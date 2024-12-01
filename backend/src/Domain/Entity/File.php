<?php

declare(strict_types=1);

namespace Fpv\Domain\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

use Fpv\Domain\AbstractSerializable;

#[ORM\Entity]
#[ORM\Table(name: 'files')]
final class File extends AbstractSerializable
{
    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    #[ORM\Column(name: 'filename', type: Types::STRING, length: 255, nullable: false)]
    private string $filename;

    #[ORM\Column(name: 'file_size', type: Types::INTEGER, nullable: false)]
    private int $fileSize;

    #[ORM\Column(name: 'media_type', type: Types::STRING, length: 255, nullable: false)]
    private string $mediaType;

    #[ORM\Column(name: 'owner_email', type: Types::STRING, length: 255, nullable: true)]
    private ?string $ownerEmail;

    #[ORM\Column(name: 'url', type: Types::STRING, length: 255, nullable: false)]
    private string $url;

    #[ORM\Column(name: 'file_key', type: Types::STRING, length: 255, nullable: false)]
    private string $fileKey;

    #[ORM\Column(name: 'url_thumb', type: Types::STRING, length: 255, nullable: true)]
    private ?string $urlThumb;

    #[ORM\Column(name: 'file_key_thumb', type: Types::STRING, length: 255, nullable: true)]
    private ?string $fileKeyThumb;

    #[ORM\Column(name: 'publish', type: Types::BOOLEAN, nullable: false)]
    private bool $publish;

    #[ORM\Column(name: 'changed_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    private DateTimeImmutable $changedAt;

    #[ORM\Column(name: 'registered_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    private DateTimeImmutable $registeredAt;

    public function __construct(array $data)
    {
        $this->filename = $data['filename'];
        $this->fileSize = $data['fileSize'];
        $this->mediaType = $data['mediaType'];
        $this->ownerEmail = $data['ownerEmail'] ?? null;
        $this->url = $data['url'];
        $this->fileKey = $data['fileKey'];
        $this->urlThumb = $data['urlThumb'] ?? null;
        $this->fileKeyThumb = $data['fileKeyThumb'] ?? null;
        $this->publish = $data['publish'];
        $this->changedAt = $data['changed_at'];
        $this->registeredAt = $data['registered_at'];
    }

    // Getter and Setter for $id
    public function getId(): int
    {
        return $this->id;
    }

    // Getter and Setter for $filename
    public function getFilename(): string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): void
    {
        $this->filename = $filename;
    }

    // Getter and Setter for $fileSize
    public function getFileSize(): int
    {
        return $this->fileSize;
    }

    public function setFileSize(int $fileSize): void
    {
        $this->fileSize = $fileSize;
    }

    // Getter and Setter for $mediaType
    public function getMediaType(): string
    {
        return $this->mediaType;
    }

    public function setMediaType(string $mediaType): void
    {
        $this->mediaType = $mediaType;
    }

    // Getter and Setter for $ownerEmail
    public function getOwnerEmail(): ?string
    {
        return $this->ownerEmail;
    }

    public function setOwnerEmail(?string $ownerEmail): void
    {
        $this->ownerEmail = $ownerEmail;
    }

    // Getter and Setter for $url
    public function getUrl(): string
    {
        return $this->url;
    }

    public function setUrl(string $url): void
    {
        $this->url = $url;
    }

    // Getter and Setter for $fileKey
    public function getFileKey(): string
    {
        return $this->fileKey;
    }

    public function setFileKey(string $fileKey): void
    {
        $this->fileKey = $fileKey;
    }

    // Getter and Setter for $urlThumb
    public function getUrlThumb(): ?string
    {
        return $this->urlThumb;
    }

    public function setUrlThumb(?string $urlThumb): void
    {
        $this->urlThumb = $urlThumb;
    }

    // Getter and Setter for $fileKeyThumb
    public function getFileKeyThumb(): ?string
    {
        return $this->fileKeyThumb;
    }

    public function setFileKeyThumb(?string $fileKeyThumb): void
    {
        $this->fileKeyThumb = $fileKeyThumb;
    }

    // Getter and Setter for $publish
    public function isPublish(): bool
    {
        return $this->publish;
    }

    public function setPublish(bool $publish): void
    {
        $this->publish = $publish;
    }

    // Getter and Setter for $changedAt
    public function getChangedAt(): DateTimeImmutable
    {
        return $this->changedAt;
    }

    public function setChangedAt(DateTimeImmutable $changedAt): void
    {
        $this->changedAt = $changedAt;
    }

    // Getter and Setter for $registeredAt
    public function getRegisteredAt(): DateTimeImmutable
    {
        return $this->registeredAt;
    }

    public function setRegisteredAt(DateTimeImmutable $registeredAt): void
    {
        $this->registeredAt = $registeredAt;
    }
}
