<?php

declare(strict_types=1);

namespace Fpv\API;

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
    private S3Client $wasabi;

    public function __construct(S3Client $wasabi)
    {
        $this->wasabi = $wasabi;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        Utils::requestLog();

        $userinfo = $request->getAttribute('userinfo');
        Utils::argsDump($userinfo);

        $data = $request->getParsedBody();


        switch ($_SERVER['REQUEST_URI']) {
                // Public access -------------------------
            case '/api/wasabi':
                $result = $this->wasabi->getObject([
                    'Bucket' => `jpv.jp`,
                    'Key' => 'public/' . $data['fileName'],
                ]);
                return Utils::toResourceResponse($result);
                // Private access -------------------------
            case '/api/wasabi/user':
                $result = $this->wasabi->getObject([
                    'Bucket' => `jpv.jp`,
                    'Key' => 'user/' . $userinfo['email'] . '/' . $data['fileName'],
                ]);
                return Utils::toResourceResponse($result);

                // Private upload -------------------------
            case '/api/wasabi/upload/user':
                $files = $request->getUploadedFiles();
                $file = $files['file'];
                if ($file->getError() === UPLOAD_ERR_OK) {

                    $fileKeyName = 'user/' . $userinfo['email'] . '/' . $file->getClientFilename();

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
                            'Bucket' => `jpv.jp`,
                            'Key' => $fileKeyName,
                            'Body' => file_get_contents($file->getStream()->getMetadata('uri')),
                        ]);
                    } else {
                        // Upload (Multipart) -------------------------
                        $uploader = new MultipartUploader(
                            $this->wasabi,
                            $file->getStream()->getMetadata('uri'),
                            [
                                'Bucket' => `jpv.jp`,
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
                    return Utils::toResponse(200, ['wasabi_file_key' => $fileKeyName]);
                }
                return Utils::toErrorMessage(500, 'Upload error');
            default:
                return Utils::toErrorMessage(501, '?');
        }
    }
}
