<?php

declare(strict_types=1);

namespace Fpv\Library;

use UMA\DIC\Container;
use UMA\DIC\ServiceProvider;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\RequestHandlerInterface;

use Nyholm\Psr7\Response;
use Nyholm\Psr7\Stream;

use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Middleware\ContentLengthMiddleware;
use Slim\Handlers\ErrorHandler;
use Slim\Exception\HttpInternalServerErrorException;

// use Monolog\Logger;
// use Monolog\Handler\StreamHandler;
// use Monolog\Level;

use Doctrine\ORM\EntityManager;

use Faker\Factory;
use Aws\S3\S3Client;
use PHPMailer\PHPMailer\PHPMailer;
use Cloudinary\Api\Admin\AdminApi;

use Fpv\Middleware\CorsMiddleware;
use Fpv\Middleware\PermissionMiddleware;

use Fpv\GraphQL\GraphQLHandler;

use Throwable;

use Fpv\API\ListUsers;
use Fpv\Domain\User;

use Doctrine\ORM\ORMSetup;

use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class DefaultErrorHandler extends ErrorHandler
{
    protected function logError(string $error): void
    {
        // Insert custom error logging function.
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
        $c->set(ListUsers::class, static function (ContainerInterface $c): RequestHandlerInterface {
            return new ListUsers(
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
            $app->post('/graphql', GraphQLHandler::class);

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

            // ListUsers
            // ------------------------------------------------------------------
            $app->get('/api/users', ListUsers::class);
            $app->post('/api/user', ListUsers::class);

            // $em = $c->get(EntityManager::class);
            // $app->get('/api/users', function ($request, $response, $args) use ($em) {
            //     $users = $em->getRepository(User::class)->findAll();
            //     $response->getBody()->write(json_encode($users));
            //     return $response;
            // });

            // $app->post('/api/wasabi', WasabiUploader::class)->add(PermissionMiddleware::class);
            // $app->post('/api/wasabi2', WasabiDownloader::class)->add(PermissionMiddleware::class);
            // $app->get('/api/users', ListUsers::class);
            // $app->post('/api/users', CreateUser::class);
            // $app->post('/graphql', SchemaHandler::class)->add(PermissionMiddleware::class);

            $errorMiddleware = $app->addErrorMiddleware(
                $settings['slim']['displayErrorDetails'],
                $settings['slim']['logErrors'],
                $settings['slim']['logErrorDetails'],
            );
            $defaultErrorHandler = new DefaultErrorHandler($app->getCallableResolver(), $app->getResponseFactory());
            $errorMiddleware->setDefaultErrorHandler($defaultErrorHandler);
            // $errorMiddleware->setErrorHandler(HttpInternalServerErrorException::class, function (ServerRequestInterface $request, Throwable $exception, bool $displayErrorDetails): ResponseInterface {
            //     $body = Stream::create(json_encode(['message' => $exception->getMessage()], JSON_PRETTY_PRINT) . PHP_EOL);
            //     return new Response(500, ['Content-Type' => 'application/json'], $body);
            // });

            // // Error handling middleware
            // $errorMiddleware = $app->addErrorMiddleware(true, true, true);
            // $errorMiddleware->setDefaultErrorHandler(null);

            // // Set log level (optional)
            // $app->getContainer()->get('logger')->setLevel(LogLevel::ERROR);

            return $app;
        });
    }
}
