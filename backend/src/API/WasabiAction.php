<?php

declare(strict_types=1);

namespace Fpv\API;

use Doctrine\ORM\EntityManager;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Aws\S3\S3Client;
use Aws\S3\MultipartUploader;
use Aws\S3\Exception\S3Exception;
use Aws\Exception\MultipartUploadException;

use Fpv\Library\Utils;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
final class WasabiAction
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        Utils::requestLog($request);
        $em = $this->container->get(EntityManager::class);
        $wasabi = $this->container->get(S3Client::class);

        $uriPath = $request->getUri()->getPath();
        try {
            if (str_starts_with($uriPath, '/api/wasabi/public')) {

                // Public access -------------------------
                return $this->download($wasabi, 'public/' . $args['fileName']);
            } elseif (str_starts_with($uriPath, '/api/wasabi/user')) {

                // Private access -------------------------
                $userinfo = $request->getAttribute('userinfo');
                return $this->download($wasabi, 'user/' . $userinfo['email'] . '/' . $args['fileName']);
            } elseif (str_starts_with($uriPath, '/api/wasabi/upload/user')) {

                // Private upload -------------------------
                $userinfo = $request->getAttribute('userinfo');
                $files = $request->getUploadedFiles();
                $fileKeyNames = [];
                foreach ($files as $file) {
                    $fileKeyName = 'user/' . $userinfo['email'] . '/' . $file->getClientFilename();
                    $this->upload($wasabi, $file, $fileKeyName);
                    $fileKeyNames[] = '/api/wasabi/user/' . $file->getClientFilename();
                }
                return Utils::toResponse(200, $fileKeyNames);
            }
        } catch (S3Exception $e) {
            return Utils::toErrorMessage(404, $e->getMessage());
        }
        return Utils::toErrorMessage(501, '?');
    }

    // Download
    // --------------------------------------------------------------------
    private function download(S3Client $wasabi, string $key): ResponseInterface
    {
        $result = $wasabi->getObject([
            'Bucket' => 'fpv.jp',
            'Key' => $key,
        ]);
        return Utils::toResourceResponse($result);
    }

    // Upload
    // --------------------------------------------------------------------
    private function upload(S3Client $wasabi, $file, string $fileKeyName)
    {
        if ($file->getError() === UPLOAD_ERR_OK) {
            $mediaType = $file->getClientMediaType();
            if (strpos($mediaType, 'video/') === 0 || strpos($mediaType, 'image/') === 0) {
                // $thumbnailFile = $files['thumbnail'];
                // $tempThumbnailFileName = $thumbnailFile->getStream()->getMetadata('uri');
                // $this->uploadWasabi($tempThumbnailFileName, $bucket, $fileKey . '_thumbnail');
            }
            // 100MB
            $uri = $file->getStream()->getMetadata('uri');
            if ($file->getSize() < 100 * 1024 * 1024) {
                // Upload -------------------------
                $wasabi->putObject([
                    'Bucket' => 'fpv.jp',
                    'Key' => $fileKeyName,
                    'Body' => file_get_contents($uri),
                    'ContentType' => mime_content_type($uri),
                ]);
            } else {
                // MultipartUpload -------------------------
                $uploader = new MultipartUploader(
                    $wasabi,
                    $uri,
                    [
                        'Bucket' => 'fpv.jp',
                        'Key' => $fileKeyName,
                        'ContentType' => mime_content_type($uri),
                    ]
                );

                $result = $uploader->upload();
                do {
                    try {
                        $result = $uploader->upload();
                    } catch (MultipartUploadException $e) {
                        $uploader = new MultipartUploader(
                            $wasabi,
                            $file->getStream()->getMetadata('uri'),
                            [
                                'state' => $e->getState(),
                            ]
                        );
                    }
                } while (!isset($result));
            }
        }
    }
}
