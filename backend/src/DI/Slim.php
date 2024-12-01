<?php declare(strict_types=1);

namespace FpvJp\DI;

use Doctrine\ORM\EntityManager;
use Faker\Factory;
use Psr\Container\ContainerInterface;
use Psr\Http\Server\RequestHandlerInterface;
// use Psr\Http\Message\ResponseInterface;
// use Psr\Http\Message\ServerRequestInterface;
use Slim\App;
use Slim\Factory\AppFactory;
// use Slim\Routing\RouteContext;
use Slim\Middleware\ContentLengthMiddleware;
use UMA\DIC\Container;
use UMA\DIC\ServiceProvider;

use Aws\S3\S3Client;

// use Psr\Log\LoggerInterface;
use FpvJp\Logger\MonologLogger;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

use FpvJp\Middleware\PermissionMiddleware;
use FpvJp\Middleware\CorsMiddleware;

use FpvJp\Handler\DefaultErrorHandler;

use FpvJp\Rest\CreateUser;
use FpvJp\Rest\ListUsers;
use FpvJp\Rest\WasabiUploader;
use FpvJp\Rest\WasabiDownloader;

use FpvJp\GraphQL\SchemaHandler;

// use Cloudinary\Cloudinary;
// use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Admin\AdminApi;

use PHPMailer\PHPMailer\PHPMailer;

use Slim\Exception\HttpInternalServerErrorException;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

use Nyholm\Psr7\Response;
use Nyholm\Psr7\Stream;

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

        $c->set(CreateUser::class, static function (ContainerInterface $c): RequestHandlerInterface {
            return new CreateUser($c->get(EntityManager::class), $c->get(PHPMailer::class), Factory::create());
        });

        $c->set(WasabiUploader::class, static function (ContainerInterface $c): RequestHandlerInterface {
            return new WasabiUploader($c->get(S3Client::class));
        });

        $c->set(WasabiDownloader::class, static function (ContainerInterface $c): RequestHandlerInterface {
            return new WasabiDownloader($c->get(S3Client::class));
        });

        $c->set(SchemaHandler::class, static function (ContainerInterface $c): RequestHandlerInterface {
            return new SchemaHandler($c->get(EntityManager::class), $c->get(AdminApi::class), $c->get(PHPMailer::class), $c->get(S3Client::class), Factory::create());
        });

        $c->set(App::class, static function (ContainerInterface $ci): App {

            /** @var array $settings */
            $settings = $ci->get('settings');

            $app = AppFactory::create(null, $ci);

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

            $app->post('/api/wasabi', WasabiUploader::class)->add(PermissionMiddleware::class);
            $app->post('/api/wasabi2', WasabiDownloader::class)->add(PermissionMiddleware::class);

            $app->get('/api/users', ListUsers::class);
            $app->post('/api/users', CreateUser::class);

            $app->post('/graphql', SchemaHandler::class)->add(PermissionMiddleware::class);

            $monologLogger = new Logger('app');
            $streamHandler = new StreamHandler(__DIR__ . '/app.log', 100);
            $monologLogger->pushHandler($streamHandler);
            $errorMiddleware = $app->addErrorMiddleware(
                $settings['slim']['displayErrorDetails'],
                $settings['slim']['logErrors'],
                $settings['slim']['logErrorDetails'],
                $monologLogger,
            );
            $defaultErrorHandler = new DefaultErrorHandler($app->getCallableResolver(), $app->getResponseFactory());
            $errorMiddleware->setDefaultErrorHandler($defaultErrorHandler);
            $errorMiddleware->setErrorHandler(HttpInternalServerErrorException::class, function (ServerRequestInterface $request, Throwable $exception, bool $displayErrorDetails):ResponseInterface {
                $body = Stream::create(json_encode(['message' => $exception->getMessage()], JSON_PRETTY_PRINT) . PHP_EOL);
                return new Response(500, ['Content-Type' => 'application/json'], $body);
            });
            return $app;
        });
    }
}

// $container = $app->getContainer();

// $app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
//     throw new HttpNotFoundException($request);
// });

// $app->add(function (ServerRequestInterface $request, RequestHandlerInterface $handler) {
//     return $handler->handle($request);
// });

// $app->get('/api/hello/{name}', function (ServerRequestInterface $request, ResponseInterface $response, $args) {
//     $routeContext = RouteContext::fromRequest($request);
//     $basePath = $routeContext->getBasePath();
//     $name = $args['name'];
//     $params = $request->getServerParams();
//     $authorization = $params['HTTP_AUTHORIZATION'] ?? null;
//     $response->getBody()->write("Hello, $name $authorization $basePath");
//     $jsonResponse = json_encode($admin->assets());
//     $response->getBody()->write($jsonResponse);
//     return $response->withHeader('Content-Type', 'application/json');
// })->add(PermissionMiddleware::class);
