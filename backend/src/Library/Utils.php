<?php

declare(strict_types=1);

namespace Fpv\Library;

use Nyholm\Psr7\Response;
use Nyholm\Psr7\Stream;
use Psr\Http\Message\ResponseInterface;

class Utils
{
    /**
     * Create a PSR-7 compliant JSON response.
     *
     * @param int $status HTTP status code.
     * @param mixed $result Data to be included in the response body.
     * @return ResponseInterface
     */
    public static function toResponse(int $status, $result): ResponseInterface
    {
        $headers = ['Content-Type' => 'application/json'];
        $body = Stream::create(json_encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return new Response($status, $headers, $body);
    }

    public static function toErrorMessage(int $status, string $message): ResponseInterface
    {
        error_log($message);
        $headers = ['Content-Type' => 'application/json'];
        return new Response($status, $headers, ['error' => $message]);
    }

    public static function requestLog(): void
    {
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                error_log($_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'], 0);
                // Utils::argsDump($_GET);
                break;
            case 'POST':
                error_log($_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'], 0);
                $input = json_decode(file_get_contents('php://input'), true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    Utils::argsDump($input);
                } else{
                    error_log('Invalid JSON body :' . json_last_error());
                }
                break;
            default:
        }
    }

    public static function argsDump($args): void
    {
        error_log(json_encode($args, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL, 0);
    }
}
