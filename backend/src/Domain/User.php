<?php declare(strict_types=1);

namespace Fpv\Domain;

use DateTimeImmutable;
use JsonSerializable;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;
use Doctrine\DBAL\Types\Types;

use function password_hash;

// The User class demonstrates how to annotate a simple PHP class to act as a Doctrine entity.
// https://www.doctrine-project.org/projects/doctrine-orm/en/3.0/reference/basic-mapping.html

#[Entity, Table(name: 'users')]
final class User implements JsonSerializable
{
    #[Id, Column(type: Types::INTEGER), GeneratedValue(strategy: 'AUTO')]
    private int $id;

    #[Column(name: 'email', type: Types::STRING, unique: true, nullable: false)]
    private string $email;

    #[Column(name: 'bcrypt_hash', type: Types::STRING, length: 60, nullable: false)]
    private string $hash;
    
    #[Column(name: 'registered_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    private DateTimeImmutable $registeredAt;

    public function __construct(string $email, string $password)
    {
        $this->email = $email;
        $this->hash = password_hash($password, PASSWORD_BCRYPT);
        $this->registeredAt = new DateTimeImmutable('now');
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getHash(): string
    {
        return $this->hash;
    }

    public function getRegisteredAt(): DateTimeImmutable
    {
        return $this->registeredAt;
    }

    public function updateParameters($args)
    {
        if (isset($args['email'])) {
            $this->email = $args['email'];
        }
        if (isset($args['password'])) {
            $this->hash = password_hash($args['password'], PASSWORD_BCRYPT);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->getId(),
            'email' => $this->getEmail(),
            'registered_at' => $this->getRegisteredAt()->format(DateTimeImmutable::ATOM)
        ];
    }
}
