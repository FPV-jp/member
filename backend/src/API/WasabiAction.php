<?php

declare(strict_types=1);

namespace Fpv\API;

use DateTimeImmutable;
use Doctrine\ORM\EntityManager;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Slim\Routing\RouteContext;

use Aws\S3\S3Client;
use Aws\S3\MultipartUploader;
use Aws\S3\Exception\S3Exception;
use Aws\Exception\MultipartUploadException;

use Fpv\Library\Utils;

use Fpv\Domain\Entity\File;

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

        $wasabi = $this->container->get(S3Client::class);
        $userinfo = $request->getAttribute('userinfo');

        $uriPath = RouteContext::fromRequest($request)->getRoute()->getPattern();
        try {

            // List
            // --------------------------------------------------------------------
            if (str_starts_with($uriPath, '/api/wasabi/list/public')) {
                // Public access -------------------------
                $files = $this->list($wasabi, 'public/');
                foreach ($files as $file) {
                    $file['Key'] = '/api/wasabi/public/' . $file['Key'];
                }
                unset($file);
                return Utils::toResponse(200, $files);
            }
            
            if (str_starts_with($uriPath, '/api/wasabi/list/user')) {
                // Private access -------------------------
                $files = $this->list($wasabi, 'user/' . $userinfo->getEmail() . '/');
                foreach ($files as &$file) {
                    $file['Key'] = '/api/wasabi/user/' . $file['Key'];
                }
                unset($file);
                return Utils::toResponse(200, $files);
            }

            // Download
            // --------------------------------------------------------------------
            if (str_starts_with($uriPath, '/api/wasabi/public')) {
                // Public access -------------------------
                return $this->download($wasabi, 'public/' . $args['fileName']);
            }

            if (str_starts_with($uriPath, '/api/wasabi/user')) {
                // Private access -------------------------
                return $this->download($wasabi, 'user/' . $userinfo->getEmail() . '/' . $args['fileName']);
            }

            // Upload
            // --------------------------------------------------------------------
            if (str_starts_with($uriPath, '/api/wasabi/upload/public')) {
                // Public access -------------------------
                $files = [];
                $em = $this->container->get(EntityManager::class);
                $fileRepo = $em->getRepository(File::class);
                foreach ($request->getUploadedFiles() as $file) {
                    $this->upload($wasabi, $file, 'public/' . $file->getClientFilename());
                    $files[] = '/api/wasabi/public/' . $file->getClientFilename();
                }
                return Utils::toResponse(200, $files);
            }

            if (str_starts_with($uriPath, '/api/wasabi/upload/user')) {
                // Private upload -------------------------
                $files = [];
                $em = $this->container->get(EntityManager::class);
                $fileRepo = $em->getRepository(File::class);
                foreach ($request->getUploadedFiles() as $file) {
                    $fileName =  $file->getClientFilename();
                    $email = $userinfo->getEmail();
                    $fileKey = 'user/' . $email . '/' . $fileName;
                    $fileData = $fileRepo->findOneBy(['fileKey' => $fileKey]);
                    if ($fileData === null){
                        $fileData = new File([
                            'filename' => $fileName,
                            'fileSize' => $file->getSize(),
                            'mediaType' => $file->getClientMediaType(),
                            'ownerEmail' => $email,
                            'url' => '/api/wasabi/user/' . $fileName,
                            'fileKey' => $fileKey,
                            'urlThumb' => '/api/wasabi/user/thumb/' . $fileName,
                            'fileKeyThumb' => 'user/' . $email . '/thumb/' . $fileName,
                            'publish' => false,
                            'changed_at' => new DateTimeImmutable('now'),
                            'registered_at' => new DateTimeImmutable('now'),
                        ]);
                        $em->persist($fileData);
                    } else {
                        $fileData->setFileSize($file->getSize());
                        $fileData->setMediaType($file->getClientMediaType());
                        $fileData->setChangedAt(new DateTimeImmutable('now'));
                    }
                    $this->upload($wasabi, $file, $fileData->getFileKey());
                    $files[] = $fileData->getUrl();
                }
                $em->flush();
                return Utils::toResponse(200, $files);
            }
        } catch (S3Exception $e) {
            return Utils::toResponse(404, ['error' => $e->getMessage()]);
        }
        return Utils::toResponse(501, ['error' => 'Not Implemented']);
    }

    // List
    // --------------------------------------------------------------------
    private function list(S3Client $wasabi, string $prefix = 'public/'): array
    {
        $result = $wasabi->listObjectsV2([
            'Bucket' => 'fpv.jp',
            'Prefix' => $prefix,
            'MaxKeys' => 2,
        ]);
        $files = [];
        if (isset($result['Contents'])) {
            foreach ($result['Contents'] as $object) {
                $files[] = [
                    'Key' => basename($object['Key']),
                    'Size' => $object['Size'],
                    'LastModified' => $object['LastModified']->format('c'),
                ];
            }
        }
        return $files;
    }

    // Download
    // --------------------------------------------------------------------
    private function download(S3Client $wasabi, string $fileKey): ResponseInterface
    {
        $result = $wasabi->getObject([
            'Bucket' => 'fpv.jp',
            'Key' => $fileKey,
        ]);
        return Utils::toResourceResponse($result);
    }

    // Upload
    // --------------------------------------------------------------------
    private function upload(S3Client $wasabi, $file, string $fileKey)
    {
        if ($file->getError() !== UPLOAD_ERR_OK) {
            return;
        }

        $type = $file->getClientMediaType();
        $uri = $file->getStream()->getMetadata('uri');


        if (strpos($type, 'video/') === 0 || strpos($type, 'image/') === 0) {
            // $thumbFile = $files['thumb'];
            // $tempThumbFileName = $thumbFile->getStream()->getMetadata('uri');
            // $this->uploadWasabi($tempThumbFileName, $bucket, $fileKey . '_thumb');
        }

        // 100MB
        if ($file->getSize() < 100 * 1024 * 1024) {

            // Upload -------------------------
            $wasabi->putObject([
                'Bucket' => 'fpv.jp',
                'Key' => $fileKey,
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
                    'Key' => $fileKey,
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
                        $uri,
                        [
                            'state' => $e->getState(),
                        ]
                    );
                }
            } while (!isset($result));
        }
    }
}
