<?php

declare(strict_types=1);

namespace Fpv\Library;

use UMA\DIC\Container;
use UMA\DIC\ServiceProvider;

use Psr\Container\ContainerInterface;

use Aws\S3\S3Client;

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

            putenv('AWS_CONFIG_FILE=/home/fpv/.wasabi');

            $wasabiClient = new S3Client([
                'version' => 'latest',
                'region' => 'ap-northeast-1',
                'credentials' => [
                    'key' => $settings['wasabi']['apikey'],
                    'secret' => $settings['wasabi']['apisecret'],
                ],
                'endpoint' => 'https://s3.ap-northeast-1.wasabisys.com',
                'use_path_style_endpoint' => true
            ]);

            return $wasabiClient;
        });
    }
}
