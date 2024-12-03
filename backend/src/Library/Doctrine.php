<?php declare(strict_types=1);

namespace Fpv\Library;

use UMA\DIC\Container;
use UMA\DIC\ServiceProvider;

use Psr\Container\ContainerInterface;

use Doctrine\ORM\EntityManager;
use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\ORMSetup;

use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

use Fpv\Logger\DoctrineLoggingMiddleware;

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
                $config->setMiddlewares([new DoctrineLoggingMiddleware()]);
            }

            $connection = DriverManager::getConnection($settings['doctrine']['connection'], $config);

            return new EntityManager($connection, $config);
        });
    }
}
