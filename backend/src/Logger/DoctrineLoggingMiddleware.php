<?php declare(strict_types=1);

namespace Fpv\Logger;

use Doctrine\DBAL\Driver;
use Doctrine\DBAL\Driver\Middleware;

use Fpv\Logger\MonologLogger;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class DoctrineLoggingMiddleware implements Middleware
{
    private MonologLogger $logger;

    public function __construct(MonologLogger $logger)
    {
        $this->logger = $logger;
    }

    public function wrap(Driver $driver): Driver
    {
        return $driver;
    }
}
