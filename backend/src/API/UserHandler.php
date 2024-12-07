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

        $userRepo = $this->em->getRepository(User::class);

        switch ($_SERVER['REQUEST_URI']) {
            case '/api/user':
                $id = htmlspecialchars($_GET["id"]);
                $user = $userRepo->find($id);
                return Utils::toResponse(200, $user);

            case '/api/users':
                $users = $userRepo->findAll();
                return Utils::toResponse(200, $users);

            case '/api/createUser':
                $email = htmlspecialchars($_POST['email']);
                $password = htmlspecialchars($_POST['password']);
                $newRandomUser = new User($email, $password);
                $this->em->persist($newRandomUser);
                $this->em->flush();
                return Utils::toResponse(200, $newRandomUser);

            case '/api/updateUser':
                $id = htmlspecialchars($_POST["id"]);
                $user = $userRepo->find($id);
                $user->updateParameters($_POST);
                $this->em->flush();
                break;

            case '/api/deleteUser':
                $id = htmlspecialchars($_POST["id"]);
                $user = $userRepo->find($id);
                $this->em->remove($user);
                $this->em->flush();
                break;
            default:
                return Utils::toErrorMessage(501, 'x');
        }
    }
}
