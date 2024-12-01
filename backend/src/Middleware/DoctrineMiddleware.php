<?php declare(strict_types=1);

namespace Fpv\Middleware;

use Doctrine\DBAL\Driver;
use Doctrine\DBAL\Driver\Middleware as MiddlewareInterface;

// use Monolog\Logger;
// use Monolog\Handler\StreamHandler;
// use Monolog\Level;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class DoctrineMiddleware implements MiddlewareInterface
{
    // private Logger $logger;

    public function __construct()
    {
        // $this->logger = new Logger("db");
        // $this->logger->pushHandler(new StreamHandler('php://stdout', Level::Info));
    }

    public function wrap(Driver $driver): Driver
    {
        // $this->logger->info("wrap");
        return $driver;
    }

    // public function startQuery($sql, ?array $params = null, ?array $types = null)
    // {
    //     $this->logger->info($sql);
    // }

    // public function stopQuery()
    // {

    // }
}
