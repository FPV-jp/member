<?php declare(strict_types=1);

// bootstrap.php

use UMA\DIC\Container;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
use Doctrine\DBAL\DriverManager;

use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

// use Fpv\Logger\MonologLogger;
// use Fpv\Logger\DoctrineLoggingMiddleware;

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

    // if ($settings['doctrine']['dev_mode']) {
    //     $config->setMiddlewares([new DoctrineLoggingMiddleware(new MonologLogger("bootstrap"))]);
    // }
    
    $connection = DriverManager::getConnection($settings['doctrine']['connection'], $config);

    return new EntityManager($connection, $config);
});

return $container;
