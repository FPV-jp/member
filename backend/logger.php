<?php declare(strict_types=1);

namespace Fpv\Logger;

use Monolog\Logger;

use Psr\Log\LoggerInterface;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Driver\Middleware;
use Doctrine\DBAL\Driver;
use Doctrine\DBAL\Driver\Connection;
use Doctrine\DBAL\ParameterType;
use Doctrine\DBAL\Driver\API\ExceptionConverter;
use Doctrine\DBAL\Driver\Statement;
use Doctrine\DBAL\Driver\Result;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class MonologLogger implements LoggerInterface
{
    /** @var Logger */
    private $logger;

    public function __construct(string $name, array $handlers = [])
    {
        $this->logger = new Logger($name);

        // Add handlers, if provided
        foreach ($handlers as $handler) {
            $this->logger->pushHandler($handler);
        }
    }

    public function emergency($message, array $context = []): void
    {
        $this->logger->emergency($message, $context);
    }

    public function alert($message, array $context = []): void
    {
        $this->logger->alert($message, $context);
    }

    public function critical($message, array $context = []): void
    {
        $this->logger->critical($message, $context);
    }

    public function error($message, array $context = []): void
    {
        $this->logger->error($message, $context);
    }

    public function warning($message, array $context = []): void
    {
        $this->logger->warning($message, $context);
    }

    public function notice($message, array $context = []): void
    {
        $this->logger->notice($message, $context);
    }

    public function info($message, array $context = []): void
    {
        $this->logger->info($message, $context);
    }

    public function debug($message, array $context = []): void
    {
        $this->logger->debug($message, $context);
    }

    public function log($level, $message, array $context = []): void
    {
        $this->logger->log($level, $message, $context);
    }
}

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
        return new class($driver, $this->logger) implements Driver {
            private Driver $driver;
            private MonologLogger $logger;

            public function __construct(Driver $driver, MonologLogger $logger)
            {
                $this->driver = $driver;
                $this->logger = $logger;
            }
    
            public function connect(array $params): Connection
            {
                $connection = $this->driver->connect($params);

                return new class($connection, $this->logger) implements Connection {
                    private Connection $connection;
                    private MonologLogger $logger;

                    public function __construct(Connection $connection, MonologLogger $logger)
                    {
                        $this->connection = $connection;
                        $this->logger = $logger;
                    }

                    public function prepare(string $sql): Statement
                    {
                        $this->logger->info("Preparing SQL: {$sql}");
                        return $this->connection->prepare($sql);
                    }

                    public function query(string $sql): Result
                    {
                        $this->logger->info("Executing SQL query: {$sql}");
                        return $this->connection->query($sql);
                    }

                    public function quote($value, $type = ParameterType::STRING): string
                    {
                        return $this->connection->quote($value, $type);
                    }

                    public function exec(string $sql): int
                    {
                        $this->logger->info("Executing SQL command: {$sql}");
                        return $this->connection->exec($sql);
                    }

                    public function lastInsertId($name = null): string|int|false
                    {
                        return $this->connection->lastInsertId($name);
                    }

                    public function beginTransaction(): bool
                    {
                        $this->logger->info("Starting transaction.");
                        return $this->connection->beginTransaction();
                    }

                    public function commit(): bool
                    {
                        $this->logger->info("Committing transaction.");
                        return $this->connection->commit();
                    }

                    public function rollBack(): bool
                    {
                        $this->logger->info("Rolling back transaction.");
                        return $this->connection->rollBack();
                    }

                };
            }

            public function getDatabasePlatform(): AbstractPlatform
            {
                return $this->driver->getDatabasePlatform();
            }

            public function getExceptionConverter(): ExceptionConverter
            {
                return $this->driver->getExceptionConverter();
            }

        };
    }
}
