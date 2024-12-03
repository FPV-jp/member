<?php declare(strict_types=1);

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

use Doctrine\ORM\EntityManager;

use Faker\Factory;
use Aws\S3\S3Client;
use PHPMailer\PHPMailer\PHPMailer;
use Cloudinary\Api\Admin\AdminApi;

use Fpv\Middleware\CorsMiddleware;
use Fpv\Middleware\PermissionMiddleware;

// use Fpv\Logger\MonologLogger;
use Fpv\GraphQL\SchemaHandler;

use Throwable;

use Fpv\API\ListUsers;

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
            return new ListUsers($c->get(EntityManager::class), $c->get(AdminApi::class));
        });

        // $c->set(CreateUser::class, static function (ContainerInterface $c): RequestHandlerInterface {
        //     return new CreateUser($c->get(EntityManager::class), $c->get(PHPMailer::class), Factory::create());
        // });

        // $c->set(WasabiUploader::class, static function (ContainerInterface $c): RequestHandlerInterface {
        //     return new WasabiUploader($c->get(S3Client::class));
        // });

        // $c->set(WasabiDownloader::class, static function (ContainerInterface $c): RequestHandlerInterface {
        //     return new WasabiDownloader($c->get(S3Client::class));
        // });

        $c->set(SchemaHandler::class, static function (ContainerInterface $c): RequestHandlerInterface {
            return new SchemaHandler(
                $c->get(EntityManager::class), 
                $c->get(AdminApi::class), 
                $c->get(PHPMailer::class), 
                $c->get(S3Client::class), 
                Factory::create()
            );
        });

        $c->set(App::class, static function (ContainerInterface $c): App {

            /** @var array $settings */
            $settings = $c->get('settings');

            $app = AppFactory::create(null, $c);

            $app->addRoutingMiddleware();
            $app->add(new ContentLengthMiddleware());
            $app->add(new CorsMiddleware());

            $app->options('/{routes:.+}', function ($request, $response, $args) {
                return $response;
            });

            $app->get('/api/phpinfo', function ($request, $response, $args) {
                $response->getBody()->write(json_encode(phpinfo()));
                return $response;
            });
            // $app->post('/api/wasabi', WasabiUploader::class)->add(PermissionMiddleware::class);
            // $app->post('/api/wasabi2', WasabiDownloader::class)->add(PermissionMiddleware::class);
            $app->get('/api/users', ListUsers::class);
            // $app->post('/api/users', CreateUser::class);
            $app->post('/gql', SchemaHandler::class)->add(PermissionMiddleware::class);

            // $monologLogger = new MonologLogger('app');
            $errorMiddleware = $app->addErrorMiddleware(
                $settings['slim']['displayErrorDetails'],
                $settings['slim']['logErrors'],
                $settings['slim']['logErrorDetails'],
                null,
            );

            $defaultErrorHandler = new DefaultErrorHandler($app->getCallableResolver(), $app->getResponseFactory());
            $errorMiddleware->setDefaultErrorHandler($defaultErrorHandler);
            $errorMiddleware->setErrorHandler(HttpInternalServerErrorException::class, function (ServerRequestInterface $request, Throwable $exception, bool $displayErrorDetails): ResponseInterface {
                $body = Stream::create(json_encode(['message' => $exception->getMessage()], JSON_PRETTY_PRINT) . PHP_EOL);
                return new Response(500, ['Content-Type' => 'application/json'], $body);
            });
            return $app;
        });
    }
}
