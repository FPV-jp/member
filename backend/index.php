<?php

declare(strict_types=1);

ini_set('display_errors', "On");

ini_set('upload_max_filesize', '1G');
ini_set('post_max_size', '1G');
ini_set('memory_limit', '2048M');
ini_set('max_execution_time', 300);

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use UMA\DIC\Container;
use UMA\DIC\ServiceProvider;

use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteContext;
use Slim\Middleware\ContentLengthMiddleware;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;

use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

use Doctrine\DBAL\DriverManager;
use Doctrine\DBAL\Logging\SQLLogger;

use PHPMailer\PHPMailer\PHPMailer;

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Admin\AdminApi;

use Aws\S3\S3Client;

use Fpv\Middleware\CorsMiddleware;

use Fpv\Logger\MonologLogger;
use Fpv\Logger\DoctrineLoggingMiddleware;

/** @var Container $container */
$container = require_once __DIR__ . '/bootstrap.php';


// --------------------------------------------------------------------
// object–relational mapper
// --------------------------------------------------------------------
final class Doctrine implements ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function provide(Container $c): void
    {
        $c->set(EntityManager::class, static function (ContainerInterface $c): EntityManager {

            /** @var array $settings */
            $settings = $c->get('settings');

            $config = ORMSetup::createAttributeMetadataConfiguration(
                $settings['doctrine']['metadata_dirs'],
                $settings['doctrine']['dev_mode'],
                null,
                $settings['doctrine']['dev_mode'] ?
                    new ArrayAdapter() :
                    new FilesystemAdapter(directory: $settings['doctrine']['cache_dir']),
                true
            );

            if ($settings['doctrine']['dev_mode']) {
                $config->setMiddlewares([new DoctrineLoggingMiddleware(new MonologLogger("index"))]);
            }

            $connection = DriverManager::getConnection($settings['doctrine']['connection'], $config);

            return new EntityManager($connection, $config);
        });
    }
}

$container->register(new Doctrine());

// --------------------------------------------------------------------
// full-featured email creation and transfer class
// --------------------------------------------------------------------
final class Mailer implements ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function provide(Container $c): void
    {
        $c->set(PHPMailer::class, static function (ContainerInterface $c): PHPMailer {

            /** @var array $settings */
            $settings = $c->get('settings');

            $mailer = new PHPMailer(true);
            $mailer->isSMTP();
            $mailer->SMTPAuth = true;
            $mailer->Host = $settings['mail']['host'];
            $mailer->Username = $settings['mail']['username'];
            $mailer->Password = $settings['mail']['password'];
            $mailer->Port = 587;
            $mailer->setFrom($settings['mail']['username'], 'FPV Japan' . $settings['mail']['env']);

            return $mailer;
        });
    }
}

$container->register(new Mailer());

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
        // $c->set(ListUsers::class, static function (ContainerInterface $c): RequestHandlerInterface {
        //     return new ListUsers($c->get(EntityManager::class), $c->get(AdminApi::class));
        // });

        // $c->set(CreateUser::class, static function (ContainerInterface $c): RequestHandlerInterface {
        //     return new CreateUser($c->get(EntityManager::class), $c->get(PHPMailer::class), Factory::create());
        // });

        // $c->set(WasabiUploader::class, static function (ContainerInterface $c): RequestHandlerInterface {
        //     return new WasabiUploader($c->get(S3Client::class));
        // });

        // $c->set(WasabiDownloader::class, static function (ContainerInterface $c): RequestHandlerInterface {
        //     return new WasabiDownloader($c->get(S3Client::class));
        // });

        // $c->set(SchemaHandler::class, static function (ContainerInterface $c): RequestHandlerInterface {
        //     return new SchemaHandler($c->get(EntityManager::class), $c->get(AdminApi::class), $c->get(PHPMailer::class), $c->get(S3Client::class), Factory::create());
        // });

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

            // $app->get('/api/phpinfo', function ($request, $response, $args) {
            //     $response->getBody()->write(json_encode(phpinfo()));
            //     return $response;
            // });

            // $app->post('/api/wasabi', WasabiUploader::class)->add(PermissionMiddleware::class);
            // $app->post('/api/wasabi2', WasabiDownloader::class)->add(PermissionMiddleware::class);

            // $app->get('/api/users', ListUsers::class);
            // $app->post('/api/users', CreateUser::class);

            // $app->post('/gql', SchemaHandler::class)->add(PermissionMiddleware::class);

            // $monologLogger = new Logger('app');
            // $streamHandler = new StreamHandler(__DIR__ . '/app.log', 100);
            // $monologLogger->pushHandler($streamHandler);
            // $errorMiddleware = $app->addErrorMiddleware(
            //     $settings['slim']['displayErrorDetails'],
            //     $settings['slim']['logErrors'],
            //     $settings['slim']['logErrorDetails'],
            //     $monologLogger,
            // );
            // $defaultErrorHandler = new DefaultErrorHandler($app->getCallableResolver(), $app->getResponseFactory());
            // $errorMiddleware->setDefaultErrorHandler($defaultErrorHandler);
            // $errorMiddleware->setErrorHandler(HttpInternalServerErrorException::class, function (ServerRequestInterface $request, Throwable $exception, bool $displayErrorDetails): ResponseInterface {
            //     $body = Stream::create(json_encode(['message' => $exception->getMessage()], JSON_PRETTY_PRINT) . PHP_EOL);
            //     return new Response(500, ['Content-Type' => 'application/json'], $body);
            // });
            return $app;
        });
    }
}

$container->register(new Slim());

// --------------------------------------------------------------------
// Image and Video API Platform
// --------------------------------------------------------------------
class CloudinaryAdmin implements ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function provide(Container $c): void
    {
        $c->set(AdminApi::class, static function (ContainerInterface $c): AdminApi {

            /** @var array $settings */
            $settings = $c->get('settings');

            $config = new Configuration();
            $config->cloud->cloudName = $settings['cloudinary']['cloudname'];
            $config->cloud->apiKey = $settings['cloudinary']['apikey'];
            $config->cloud->apiSecret = $settings['cloudinary']['apisecret'];
            $config->url->secure = true;

            return new AdminApi($config);
        });
    }
}

$container->register(new CloudinaryAdmin());

// --------------------------------------------------------------------
// Wasabi Hot Cloud Storage
// --------------------------------------------------------------------
class Wasabi implements ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function provide(Container $c): void
    {
        $c->set(S3Client::class, static function (ContainerInterface $c): S3Client {

            /** @var array $settings */
            $settings = $c->get('settings');

            $raw_credentials = array(
                'credentials' => [
                    'key' => $settings['wasabi']['apikey'],
                    'secret' => $settings['wasabi']['apisecret']
                ],
                'endpoint' => 'https://s3.ap-northeast-1.wasabisys.com',
                'region' => 'ap-northeast-1',
                'version' => 'latest',
                'use_path_style_endpoint' => true
            );
            putenv('AWS_CONFIG_FILE=' . $settings['wasabi']['config']);
            $s3Client = S3Client::factory($raw_credentials);
            return $s3Client;
        });
    }
}

$container->register(new Wasabi());

/** @var App $app */
$app = $container->get(App::class);
$app->run();
