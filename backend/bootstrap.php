<?php

declare(strict_types=1);

// bootstrap.php

use UMA\DIC\Container;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
use Doctrine\DBAL\DriverManager;

use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

use Fpv\Logger\DoctrineLoggingMiddleware;

require_once __DIR__ . '/vendor/autoload.php';

$container = new Container(require __DIR__ . '/settings.php');

$container->set(EntityManager::class, static function (Container $c): EntityManager {

    /** @var array $settings */
    $settings = $c->get('settings');

    $metadata_dirs = $settings['doctrine']['metadata_dirs'];
    $dev_mode = $settings['doctrine']['dev_mode'];
    $cache_dir = $settings['doctrine']['cache_dir'];
    $connect = $settings['doctrine']['connection'];

    $config = ORMSetup::createAttributeMetadataConfiguration(
        $metadata_dirs,
        $dev_mode,
        null,
        $dev_mode ? new ArrayAdapter() : new FilesystemAdapter(directory: $cache_dir),
        true
    );
    if ($dev_mode) {
        $config->setMiddlewares([new DoctrineLoggingMiddleware()]);
    }
    $connection = DriverManager::getConnection($connect, $config);
    return new EntityManager($connection, $config);
});

return $container;
