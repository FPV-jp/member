<?php

declare(strict_types=1);

namespace Fpv\API;

use Doctrine\ORM\EntityManager;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use Slim\Routing\RouteContext;

use Fpv\Library\Utils;

use Fpv\Domain\Entity\User;

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
        $em = $this->container->get(EntityManager::class);
        $userRepo = $em->getRepository(User::class);

        switch (RouteContext::fromRequest($request)->getRoute()->getPattern()) {

            case '/api/user/{id}':
                $user = $userRepo->find($request->getAttribute('id'));
                return Utils::toResponse(200, $user);

            case '/api/users':
                $users = $userRepo->findAll();
                return Utils::toResponse(200, $users);

            case '/api/createUser':
                $contents = $request->getBody()->getContents();
                $input = json_decode($contents, true);
                Utils::argsDump($input);

                $newUser = new User($input);
                $em->persist($newUser);
                $em->flush();
                return Utils::toResponse(200, $newUser);

            case '/api/updateUser':
                $contents = $request->getBody()->getContents();
                $input = json_decode($contents, true);
                Utils::argsDump($input);

                $user = $userRepo->find($input["id"]);
                $user->updateParameters($input);
                $em->flush();
                return Utils::toResponse(200, $user);

            case '/api/deleteUser':
                $contents = $request->getBody()->getContents();
                $input = json_decode($contents, true);
                Utils::argsDump($input);

                $user = $userRepo->find($input["id"]);
                $delUser = clone $user;
                $em->remove($user);
                $em->flush();
                return Utils::toResponse(200, $delUser);

            default:
                return Utils::toResponse(501, ['error' => 'Not Implemented']);
        }
    }
}
