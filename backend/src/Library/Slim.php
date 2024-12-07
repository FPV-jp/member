<?php

declare(strict_types=1);

namespace Fpv\Library;

use UMA\DIC\Container;
use UMA\DIC\ServiceProvider;

use Psr\Container\ContainerInterface;
use Psr\Http\Server\RequestHandlerInterface;

use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Middleware\ContentLengthMiddleware;
use Slim\Handlers\ErrorHandler;

use Auth0\SDK\Configuration\SdkConfiguration;

use Doctrine\ORM\EntityManager;

use Faker\Factory;
use Aws\S3\S3Client;
use PHPMailer\PHPMailer\PHPMailer;
use Cloudinary\Api\Admin\AdminApi;

use Fpv\Middleware\CorsMiddleware;
use Fpv\Middleware\PermissionMiddleware;

use Fpv\GraphQL\GraphQLHandler;

use Fpv\API\UserHandler;

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
        $c->set(UserHandler::class, static function (ContainerInterface $c): RequestHandlerInterface {
            return new UserHandler(
                $c->get(EntityManager::class),
                $c->get(AdminApi::class),
                $c->get(PHPMailer::class),
                Factory::create(),
            );
        });

        $c->set(GraphQLHandler::class, static function (ContainerInterface $c): RequestHandlerInterface {
            return new GraphQLHandler(
                $c->get(EntityManager::class),
                $c->get(AdminApi::class),
                $c->get(PHPMailer::class),
                $c->get(S3Client::class),
                Factory::create(),
            );
        });

        $c->set(App::class, static function (ContainerInterface $c): App {

            /** @var array $settings */
            $settings = $c->get('settings');

            // Auth0 middleware
            // ------------------------------------------------------------------
            $config = new SdkConfiguration([
                'domain' => $settings['auth0']['domain'],
                'clientId' => $settings['auth0']['clientId'],
                'audience' => [
                    $settings['auth0']['audience'],
                    'https://fpv.jp.auth0.com/userinfo',
                ],
                'tokenAlgorithm' => 'RS256',
                'cookieSecret' => bin2hex(random_bytes(32)),
            ]);
            $requiresAuth = new PermissionMiddleware($config, ['read:users']);

            $app = AppFactory::create(null, $c);

            $app->addRoutingMiddleware();
            $app->add(new ContentLengthMiddleware());

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
            $app->post('/graphql', GraphQLHandler::class)->add($requiresAuth);

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

            // UserHandler
            // ------------------------------------------------------------------
            $app->get('/api/user', UserHandler::class);
            $app->get('/api/users', UserHandler::class);
            $app->post('/api/createUser', UserHandler::class)->add($requiresAuth);
            $app->post('/api/updateUser', UserHandler::class)->add($requiresAuth);
            $app->post('/api/deleteUser', UserHandler::class)->add($requiresAuth);

            $errorMiddleware = $app->addErrorMiddleware(
                $settings['slim']['displayErrorDetails'],
                $settings['slim']['logErrors'],
                $settings['slim']['logErrorDetails'],
            );
            $defaultErrorHandler = new DefaultErrorHandler($app->getCallableResolver(), $app->getResponseFactory());
            $errorMiddleware->setDefaultErrorHandler($defaultErrorHandler);
            return $app;
        });
    }
}
