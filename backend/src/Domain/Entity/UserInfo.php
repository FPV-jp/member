<?php

declare(strict_types=1);

namespace Fpv\Domain\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

use Fpv\Domain\AbstractSerializable;

#[ORM\Entity]
#[ORM\Table(name: 'user_info')]
final class UserInfo extends AbstractSerializable
{
    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    #[ORM\Column(name: 'sub', type: Types::STRING, unique: true, nullable: false)]
    private string $sub;

    #[ORM\Column(name: 'given_name', type: Types::STRING, nullable: false)]
    private string $givenName;

    #[ORM\Column(name: 'family_name', type: Types::STRING, nullable: false)]
    private string $familyName;

    #[ORM\Column(name: 'nickname', type: Types::STRING, nullable: false)]
    private string $nickname;

    #[ORM\Column(name: 'name', type: Types::STRING, nullable: false)]
    private string $name;

    #[ORM\Column(name: 'picture', type: Types::STRING, nullable: false)]
    private string $picture;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    private DateTimeImmutable $updatedAt;

    #[ORM\Column(name: 'email', type: Types::STRING, unique: true, nullable: false)]
    private string $email;

    #[ORM\Column(name: 'email_verified', type: Types::BOOLEAN, nullable: false)]
    private bool $emailVerified;

    public function __construct(array $data)
    {
        $this->sub = $data['sub'];
        $this->givenName = $data['given_name'];
        $this->familyName = $data['family_name'];
        $this->nickname = $data['nickname'];
        $this->name = $data['name'];
        $this->picture = $data['picture'];
        $this->updatedAt = new DateTimeImmutable($data['updated_at']);
        $this->email = $data['email'];
        $this->emailVerified = $data['email_verified'];
    }

    // public function updateParameters(array $data): void
    // {
    //     if (isset($data['email'])) {
    //         $this->email = $data['email'];
    //     }
    //     if (isset($data['given_name'])) {
    //         $this->givenName = $data['given_name'];
    //     }
    //     if (isset($data['family_name'])) {
    //         $this->familyName = $data['family_name'];
    //     }
    //     if (isset($data['nickname'])) {
    //         $this->nickname = $data['nickname'];
    //     }
    //     if (isset($data['name'])) {
    //         $this->name = $data['name'];
    //     }
    //     if (isset($data['picture'])) {
    //         $this->picture = $data['picture'];
    //     }
    //     if (isset($data['updated_at'])) {
    //         $this->updatedAt = new DateTimeImmutable($data['updated_at']);
    //     }
    //     if (isset($data['email_verified'])) {
    //         $this->emailVerified = (bool) $data['email_verified'];
    //     }
    // }

    public function getId(): int
    {
        return $this->id;
    }

    public function getSub(): string
    {
        return $this->sub;
    }

    public function getGivenName(): string
    {
        return $this->givenName;
    }

    public function getFamilyName(): string
    {
        return $this->familyName;
    }

    public function getNickname(): string
    {
        return $this->nickname;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPicture(): string
    {
        return $this->picture;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function isEmailVerified(): bool
    {
        return $this->emailVerified;
    }

}
