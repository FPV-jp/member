<?php

declare(strict_types=1);

namespace Fpv\Library;

use Nyholm\Psr7\Response;
use Nyholm\Psr7\Stream;

use Psr\Http\Message\ServerRequestInterface;
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
        if (is_array($result)) {
            $body = Stream::create(json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        } elseif ($result instanceof \JsonSerializable) {
            $body = Stream::create(json_encode($result->jsonSerialize(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        } else {
            throw new \InvalidArgumentException('Invalid result type');
        }
        return new Response($status, $headers, $body);
    }

    public static function toResourceResponse(Result $result): ResponseInterface
    {
        // Utils::argsDump($result->get('@metadata'));
        $fileKey = $result->get('@metadata')['effectiveUri'] ?? '';
        $fileName = basename($fileKey);
        $contentType = $result->get('ContentType')
            ?? $result->get('@metadata')['headers']['content-type']
            ?? 'application/octet-stream';
        $headers = [
            'Content-Type' => $contentType,
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];
        $stream = Stream::create($result['Body']->getContents());
        return new Response(200, $headers, $stream);
    }

    public static function argsDump($args): void
    {
        error_log(json_encode($args, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL, 0);
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
