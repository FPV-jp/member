<?php declare(strict_types=1);

ini_set('display_errors', "On");

ini_set('upload_max_filesize', '1G');
ini_set('post_max_size', '1G');
ini_set('memory_limit', '2048M');
ini_set('max_execution_time', 300);

use Slim\App;
use UMA\DIC\Container;
use FpvJp\DI;
use Doctrine\Common\Cache\Psr6\DoctrineProvider;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\ORMSetup;
use Doctrine\DBAL\DriverManager;
use Psr\Container\ContainerInterface;
use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use UMA\DIC\Container;
use FpvJp\Logger\EchoSQLLogger;
// use Cloudinary\Configuration\Configuration;

/** @var Container $cnt */
require_once __DIR__ . '/vendor/autoload.php';

$container = new Container(require __DIR__ . '/settings.php');

$container->set(EntityManager::class, static function (Container $c): EntityManager {
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
        $config->setSQLLogger(new EchoSQLLogger());
    }
    $connection = DriverManager::getConnection($settings['doctrine']['connection'], $config);
    return new EntityManager($connection, $config);
});

$container->register(new DI\Doctrine());
$container->register(new DI\CloudinaryAdmin());
$container->register(new DI\Wasabi());
$container->register(new DI\Mailer());
$container->register(new DI\Slim());

/** @var App $app */
$app = $container->get(App::class);
$app->run();
