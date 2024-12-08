<?php

declare(strict_types=1);

namespace Fpv\API;

use Doctrine\ORM\EntityManager;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\StreamFactoryInterface;

use Aws\S3\S3Client;
use Aws\S3\MultipartUploader;
use Aws\S3\Exception\S3Exception;
use Aws\Exception\MultipartUploadException;

use Fpv\Library\Utils;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
final class WasabiHandler implements RequestHandlerInterface
{
    private EntityManager $em;
    private S3Client $wasabi;

    public function __construct(EntityManager $em, S3Client $wasabi)
    {
        $this->em = $em;
        $this->wasabi = $wasabi;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        Utils::requestLog();
        // Utils::argsDump($userinfo);

        $uriPath = $request->getUri()->getPath();
        if (str_starts_with($uriPath, '/api/wasabi/public')) {

            // Public access -------------------------
            $fileName = $request->getAttribute('fileName');
            $result = $this->wasabi->getObject([
                'Bucket' => 'fpv.jp',
                'Key' => 'public/' . $fileName,
            ]);
            return Utils::toResourceResponse($result);
        } elseif (str_starts_with($uriPath, '/api/wasabi/user')) {

            // Private access -------------------------
            $userinfo = $request->getAttribute('userinfo');
            $fileName = $request->getAttribute('fileName');
            $result = $this->wasabi->getObject([
                'Bucket' => 'fpv.jp',
                'Key' => 'user/' . $userinfo['email'] . '/' . $fileName,
            ]);
            return Utils::toResourceResponse($result);
        } elseif (str_starts_with($uriPath, '/api/wasabi/upload/user')) {

            // Private upload -------------------------
            $userinfo = $request->getAttribute('userinfo');
            $files = $request->getUploadedFiles();
            $fileKeyNames = [];
            foreach ($files as $file) {
                $fileKeyName = 'user/' . $userinfo['email'] . '/' . $file->getClientFilename();
                $fileKeyNames[] = '/api/wasabi/user/' . $file->getClientFilename();
                $this->upload($file, $fileKeyName);
            }
            return Utils::toResponse(200, $fileKeyNames);
        }
        return Utils::toErrorMessage(501, '?');
    }

    private function upload($file, string $fileKeyName)
    {
        if ($file->getError() === UPLOAD_ERR_OK) {
            $mediaType = $file->getClientMediaType();
            if (strpos($mediaType, 'video/') === 0 || strpos($mediaType, 'image/') === 0) {
                // $thumbnailFile = $files['thumbnail'];
                // $tempThumbnailFileName = $thumbnailFile->getStream()->getMetadata('uri');
                // $this->uploadWasabi($tempThumbnailFileName, $bucket, $fileKey . '_thumbnail');
            }
            // 100MB
            if ($file->getSize() < 100 * 1024 * 1024) {
                // Upload -------------------------
                $this->wasabi->putObject([
                    'Bucket' => 'fpv.jp',
                    'Key' => $fileKeyName,
                    'Body' => file_get_contents($file->getStream()->getMetadata('uri')),
                ]);
            } else {
                // Upload (Multipart) -------------------------
                $uploader = new MultipartUploader(
                    $this->wasabi,
                    $file->getStream()->getMetadata('uri'),
                    [
                        'Bucket' => 'fpv.jp',
                        'Key' => $fileKeyName,
                    ]
                );

                $result = $uploader->upload();
                do {
                    try {
                        $result = $uploader->upload();
                    } catch (MultipartUploadException $e) {
                        $uploader = new MultipartUploader(
                            $this->wasabi,
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
