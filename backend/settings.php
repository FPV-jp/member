<?php

declare(strict_types=1);

// settings.php

use Dotenv\Dotenv;

Dotenv::createImmutable(__DIR__)->load();

const APP_ROOT = __DIR__;

return [
    'settings' => [
        'appEnv' => $_ENV['APP_ENV'],
        'slim' => [
            // Returns a detailed HTML page with error details and a stack trace. Should be disabled in production.
            'displayErrorDetails' => true,

            // Whether to display errors on the internal PHP log or not.
            'logErrors' => true,

            // If true, display full errors with message and stack trace on the PHP log.
            // If false, display only "Slim Application Error" on the PHP log.
            // Doesn't do anything when 'logErrors' is false.
            'logErrorDetails' => true,
        ],

        'doctrine' => [
            // Enables or disables Doctrine metadata caching for either performance or convenience during development.
            'dev_mode' => false,

            // List of paths where Doctrine will search for metadata. 
            // Metadata can be either YML/XML files or annotated PHP classes.
            'metadata_dirs' => [APP_ROOT . '/src/Domain'],

            // The parameters Doctrine needs to connect to your database.
            // Refer to the Doctrine documentation to see the full list of valid parameters: https://www.doctrine-project.org/projects/doctrine-dbal/en/current/reference/configuration.html
            // These parameters depend on the driver (for instance the 'pdo_mysql' driver doesn't have a 'path', but needs 'host' and 'port' parameters among others).
            'connection' => [
                'driver'   => 'pdo_mysql',
                'host'     => $_ENV['MARIADB_HOST'],
                'port'     => $_ENV['MARIADB_PORT'],
                'dbname'   => $_ENV['MARIADB_DATABASE'],
                'user'     => $_ENV['MARIADB_USER'],
                'password' => $_ENV['MARIADB_PASSWORD'],
                'charset'  => $_ENV['MARIADB_CHARSET']
            ]
        ],

        'auth0' => [
            'domain'   => $_ENV['AUTH0_DOMAIN'],
            'clientId' => $_ENV['AUTH0_CLIENT_ID'],
            'audience' => $_ENV['AUTH0_AUDIENCE'],
            'base'     => $_ENV['AUTH0_BASE'],
            'scope'    => 'profile email read:users',
        ],

        'mail' => [
            'host'     => $_ENV['MAIL_HOST'],
            'username' => $_ENV['MAIL_USERNAME'],
            'password' => $_ENV['MAIL_PASSWORD'],
        ],

        'cloudinary' => [
            'cloudname' => $_ENV['CLOUDINARY_CLOUD_NAME'],
            'apikey'    => $_ENV['CLOUDINARY_API_KEY'],
            'apisecret' => $_ENV['CLOUDINARY_API_SECRET'],
        ],

        'wasabi' => [
            'apikey'    => $_ENV['WASABI_API_KEY'],
            'apisecret' => $_ENV['WASABI_API_SECRET'],
        ],

    ]
];
