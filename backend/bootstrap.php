<?php

declare(strict_types=1);

// bootstrap.php

use UMA\DIC\Container;
use Doctrine\ORM\Configuration;
use Doctrine\ORM\EntityManager;
use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\Mapping\Driver\AttributeDriver;

use Fpv\Middleware\DoctrineMariaDBDriver;
use Fpv\Middleware\DoctrineMiddleware;

require_once __DIR__ . '/vendor/autoload.php';

$container = new Container(require __DIR__ . '/settings.php');

$container->set(EntityManager::class, static function (Container $c): EntityManager {

    /** @var array $settings */
    $settings = $c->get('settings');

    $paths = $settings['doctrine']['metadata_dirs'];
    $isDevMode = $settings['doctrine']['dev_mode'];
    $connect = $settings['doctrine']['connection'];

    $config = new Configuration();

    $middleware = new DoctrineMiddleware();
    $config->setMiddlewares([$middleware]);

    $config->setProxyDir(sys_get_temp_dir());
    $config->setProxyNamespace('DoctrineProxies');
    $config->setAutoGenerateProxyClasses($isDevMode);
    $config->setMetadataDriverImpl(new AttributeDriver($paths));
    // $config->setMetadataDriverImpl(new DoctrineMariaDBDriver());

    $connection = DriverManager::getConnection($connect, $config);
    return new EntityManager($connection, $config);
});

return $container;
