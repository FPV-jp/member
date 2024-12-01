<?php

declare(strict_types=1);

namespace Fpv\API;

use Doctrine\ORM\EntityManager;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Fpv\Domain\User;
use Fpv\Library\Utils;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
final class UserAction
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
        $userRepo = $em->getRepository(User::class);

        switch ($request->getUri()->getPath()) {

            case '/api/user':
                $user = $userRepo->find($args["id"]);
                return Utils::toResponse(200, $user);

            case '/api/users':
                $users = $userRepo->findAll();
                return Utils::toResponse(200, $users);

            case '/api/createUser':
                $newRandomUser = new User($args['email'], $args['password']);
                $em->persist($newRandomUser);
                $em->flush();
                return Utils::toResponse(200, $newRandomUser);

            case '/api/updateUser':
                $user = $userRepo->find($args["id"]);
                $user->updateParameters($args);
                $em->flush();
                break;

            case '/api/deleteUser':
                $user = $userRepo->find($args["id"]);
                $em->remove($user);
                $em->flush();
                break;
            default:
                return Utils::toErrorMessage(501, '?');
        }
    }
}
