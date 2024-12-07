<?php

declare(strict_types=1);

namespace Fpv\API;

use Doctrine\ORM\EntityManager;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use Faker\Generator;

use Cloudinary\Api\Admin\AdminApi;

use Fpv\Domain\User;

use Fpv\Library\Utils;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
final class UserHandler implements RequestHandlerInterface
{
    private EntityManager $em;
    private AdminApi $api;
    private PHPMailer $mail;
    private Generator $faker;

    public function __construct(EntityManager $em, AdminApi $api, PHPMailer $mail, Generator $faker)
    {
        $this->em = $em;
        $this->api = $api;
        $this->mail = $mail;
        $this->faker = $faker;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        Utils::requestLog();

        if ($_SERVER['REQUEST_METHOD'] == "GET") {
            $users = $this->em->getRepository(User::class)->findAll();
            return Utils::toResponse(200, $users);
        }

        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            $newRandomUser = new User($this->faker->email(), $this->faker->password());
            $this->em->persist($newRandomUser);
            $this->em->flush();
            return Utils::toResponse(200, $newRandomUser);
        }

        $users = $this->em->getRepository(User::class)->findAll();
        return Utils::toResponse(200, $users);
    }
}
