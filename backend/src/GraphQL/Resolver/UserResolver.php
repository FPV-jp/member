<?php declare(strict_types=1);

use Fpv\Domain\User;

// use Fpv\Library\Utils;

return [
    // user =================================
    'user' => function ($rootValue, $args, $context) {
        $user = $this->em->getRepository(User::class)->find($args['id']);
        return $user->jsonSerialize();
    },
    // users =================================
    'users' => function ($rootValue, $args, $context) {
        $users = $this->em->getRepository(User::class)->findAll();
        $userArray = [];
        foreach ($users as $user) {
            $userArray[] = $user->jsonSerialize();
        }
        return $userArray;
    },
    // createUser =================================
    'createUser' => function ($rootValue, $args, $context) {
        // Utils::argsDump($context);
        $newUser = new User($args['user']['email'], $args['user']['password']);
        $this->em->persist($newUser);
        $this->em->flush();
        return $newUser->jsonSerialize();
    },
    // updateUser =================================
    'updateUser' => function ($rootValue, $args, $context) {
        $user = $this->em->getRepository(User::class)->find($args['id']);
        $user->updateParameters($args);
        $this->em->flush();
        return $user->jsonSerialize();
    },
    // deleteUser =================================
    'deleteUser' => function ($rootValue, $args, $context) {
        $user = $this->em->getRepository(User::class)->find($args['id']);
        $this->em->remove($user);
        $this->em->flush();
        return $user->jsonSerialize();
    }
];