<?php

declare(strict_types=1);

namespace Fpv\Library;

use UMA\DIC\Container;
use UMA\DIC\ServiceProvider;

use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Middleware\ContentLengthMiddleware;
use Slim\Handlers\ErrorHandler;

use Psr\Http\Message\ServerRequestInterface;
use Psr\Container\ContainerInterface;

use Fpv\Middleware\CorsMiddleware;
use Fpv\Middleware\PermissionMiddleware;

use Fpv\GraphQL\GraphQLHandler;
use Fpv\API\UserAction;
use Fpv\API\WasabiAction;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class DefaultErrorHandler extends ErrorHandler
{
    protected function logError(string $error): void
    {
        error_log($error);
    }
}

// --------------------------------------------------------------------
// micro framework for PHP
// --------------------------------------------------------------------

/**
 * A ServiceProvider for registering services related to Slim such as request handlers,
 * routing and the App service itself that wires everything together.
 */
final class Slim implements ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function provide(Container $c): void
    {
        $c->set(App::class, static function (ContainerInterface $c): App {

            /** @var array $settings */
            $settings = $c->get('settings');

            $app = AppFactory::create(null, $c);

            $app->addRoutingMiddleware();

            // Middleware
            // ------------------------------------------------------------------
            $app->addRoutingMiddleware();
            $app->add(new ContentLengthMiddleware());

            // UserInfo
            $requireAuth = new PermissionMiddleware($c, $settings['auth0'], ['read:users']);

            // ErrorHandler
            // ------------------------------------------------------------------
            $customErrorHandler = function (ServerRequestInterface $request, \Throwable $exception, bool $displayErrorDetails, bool $logErrors, bool $logErrorDetails) use ($app) {
                $payload = ['error' => $exception->getMessage()];
                $response = $app->getResponseFactory()->createResponse();
                $response->getBody()->write(json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                return $response->withStatus(500);
            };
            $errorMiddleware = $app->addErrorMiddleware(
                $settings['slim']['displayErrorDetails'],
                $settings['slim']['logErrors'],
                $settings['slim']['logErrorDetails'],
            );
            $errorMiddleware->setDefaultErrorHandler($customErrorHandler);

            // CORS
            // ------------------------------------------------------------------
            if ($settings['appEnv'] == 'loclhost:8000') {
                $app->add(new CorsMiddleware());
            }

            // OPTIONS
            // ------------------------------------------------------------------
            $app->options('/{routes:.+}', function ($request, $response, $args) {
                return $response;
            });

            // GraphQLHandler
            // ------------------------------------------------------------------
            $app->post('/graphql', GraphQLHandler::class)->add($requireAuth);

            // PHP Info
            // ------------------------------------------------------------------
            $app->get('/api/phpinfo', function ($request, $response, $args) {
                $response->getBody()->write(json_encode(phpinfo()));
                return $response;
            });

            // .env file
            // ------------------------------------------------------------------
            $app->get('/api/env', function ($request, $response, $args) use ($settings) {
                $response->getBody()->write(json_encode($settings['auth0']));
                return $response;
            });

            // UserAction
            // ------------------------------------------------------------------
            $app->get('/api/user/{id}', UserAction::class);
            $app->get('/api/users', UserAction::class);
            $app->post('/api/createUser', UserAction::class)->add($requireAuth);
            $app->post('/api/updateUser', UserAction::class)->add($requireAuth);
            $app->post('/api/deleteUser', UserAction::class)->add($requireAuth);

            // WasabiAction
            // ------------------------------------------------------------------
            $app->get('/api/wasabi/list/public', WasabiAction::class);
            $app->get('/api/wasabi/list/user', WasabiAction::class)->add($requireAuth);

            $app->get('/api/wasabi/public/{fileName}', WasabiAction::class);
            $app->get('/api/wasabi/user/{fileName}', WasabiAction::class)->add($requireAuth);
            // $app->post('/api/wasabi/public', WasabiAction::class);
            // $app->post('/api/wasabi/user', WasabiAction::class)->add($requireAuth);

            $app->post('/api/wasabi/upload/user', WasabiAction::class)->add($requireAuth);

            return $app;
        });
    }
}
