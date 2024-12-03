<?php declare(strict_types=1);

namespace Fpv\Logger;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

use Psr\Log\LoggerInterface;

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
        
        $streamHandler = new StreamHandler(__DIR__ . '/app.log', 100);
        $this->logger->pushHandler($streamHandler);

        // Add handlers, if provided
        foreach ($handlers as $handler) {
            $this->logger->pushHandler($handler);
        }
    }

    public function emergency(string|\Stringable $message, array $context = []): void
    {
        $this->logger->emergency($message, $context);
    }

    public function alert(string|\Stringable $message, array $context = []): void
    {
        $this->logger->alert($message, $context);
    }

    public function critical(string|\Stringable $message, array $context = []): void
    {
        $this->logger->critical($message, $context);
    }

    public function error(string|\Stringable $message, array $context = []): void
    {
        $this->logger->error($message, $context);
    }

    public function warning(string|\Stringable $message, array $context = []): void
    {
        $this->logger->warning($message, $context);
    }

    public function notice(string|\Stringable $message, array $context = []): void
    {
        $this->logger->notice($message, $context);
    }

    public function info(string|\Stringable $message, array $context = []): void
    {
        $this->logger->info($message, $context);
    }

    public function debug(string|\Stringable $message, array $context = []): void
    {
        $this->logger->debug($message, $context);
    }

    public function log($level, string|\Stringable $message, array $context = []): void
    {
        $this->logger->log($level, $message, $context);
    }
}
