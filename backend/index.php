<?php

// index.php

declare(strict_types=1);

ini_set('display_errors', "On");

ini_set('upload_max_filesize', '1G');
ini_set('post_max_size', '1G');
ini_set('memory_limit', '2048M');
ini_set('max_execution_time', 300);

use UMA\DIC\Container;

use Slim\App;

// use Fpv\Library\Doctrine;
use Fpv\Library\Mailer;
use Fpv\Library\Wasabi;
use Fpv\Library\Slim;

/** @var Container $container */
$container = require_once __DIR__ . '/bootstrap.php';

// $container->register(new Doctrine());
$container->register(new Mailer());
$container->register(new Wasabi());

$container->register(new Slim());

/** @var App $app */
$app = $container->get(App::class);
$app->run();
