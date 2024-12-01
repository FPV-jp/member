<?php

declare(strict_types=1);

namespace Fpv\API;

use Doctrine\ORM\EntityManager;

use Nyholm\Psr7\Response;
use Nyholm\Psr7\Stream;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use Faker\Generator;

use Cloudinary\Api\Admin\AdminApi;

use Fpv\Domain\User;

use function json_encode;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
final class ListUsers implements RequestHandlerInterface
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
        $requestMethod = $_SERVER['REQUEST_METHOD'];

        if ($requestMethod == "GET") {
            /** @var User[] $users */
            $users = $this->em->getRepository(User::class)->findAll();
            $body = Stream::create(json_encode($users, JSON_PRETTY_PRINT) . PHP_EOL);
            return new Response(200, ['Content-Type' => 'application/json'], $body);
        } 

        if ($requestMethod == "POST") {
            /** @var User $user */
            $newRandomUser = new User($this->faker->email(), $this->faker->password());
            $this->em->persist($newRandomUser);
            $this->em->flush();
            $body = Stream::create(json_encode($newRandomUser, JSON_PRETTY_PRINT) . PHP_EOL);
            return new Response(201, ['Content-Type' => 'application/json'], $body);
        }

        /** @var User[] $users */
        $users = $this->em->getRepository(User::class)->findAll();
        $body = Stream::create(json_encode($users, JSON_PRETTY_PRINT) . PHP_EOL);
        return new Response(200, ['Content-Type' => 'application/json'], $body);
    }
}
