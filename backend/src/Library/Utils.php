<?php

declare(strict_types=1);

namespace Fpv\Library;

use Nyholm\Psr7\Response;
use Nyholm\Psr7\Stream;
use Psr\Http\Message\ResponseInterface;
use Aws\Result;

use Exception;

class Utils
{
    /**
     * Create a PSR-7 compliant JSON response.
     *
     * @param int $status HTTP status code.
     * @param mixed $result Data to be included in the response body.
     * @return ResponseInterface
     */
    public static function toResponse(int $status, mixed $result): ResponseInterface
    {
        $headers = ['Content-Type' => 'application/json'];
        $body = Stream::create(json_encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return new Response($status, $headers, $body);
    }

    public static function toResourceResponse(Result $result): ResponseInterface
    {
        $fileKey = $result->get('@metadata')['effectiveUri'] ?? '';
        $fileName = basename($fileKey);
        $headers = [
            'Content-Type' => $result['ContentType'] ?? 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];
        $stream = Stream::create($result['Body']->getContents());
        return new Response(200, $headers, $stream);
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
            default:
        }
    }

    public static function argsDump($args): void
    {
        error_log(json_encode($args, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL, 0);
    }

    public static function enc($text): string
    {
        return mb_encode_mimeheader($text, 'UTF-8');
    }

    public static function renderTemplate(string $filePath, array $data): string
    {
        if (!file_exists($filePath)) {
            throw new Exception("Template file not found: $filePath");
        }
        $template = file_get_contents($filePath);
        foreach ($data as $key => $value) {
            $template = str_replace("{{{$key}}}", $value, $template);
        }
        return $template;
    }
}
