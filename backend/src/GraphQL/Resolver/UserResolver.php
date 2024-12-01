<?php

declare(strict_types=1);

use Fpv\Domain\Entity\User;

use Fpv\Library\Utils;

return [
    // user =================================
    'user' => function ($rootValue, $args, $context) {
        $userRepo = $this->em->getRepository(User::class);
        $user = $userRepo->find($args['id']);
        return $user->jsonSerialize();
    },
    // users =================================
    'users' => function ($rootValue, $args, $context) {
        $userRepo = $this->em->getRepository(User::class);
        $users = $userRepo->findAll();
        $userArray = [];
        foreach ($users as $user) {
            $userArray[] = $user->jsonSerialize();
        }
        return $userArray;
    },
    // createUser =================================
    'createUser' => function ($rootValue, $args, $context) {
        $newUser = new User($args['user']);
        $this->em->persist($newUser);
        $this->em->flush();

        // Send mail ----------------------------------------
        $userinfo = $context['userinfo'];
        $this->mailer->addAddress($userinfo->getEmail(), Utils::enc($userinfo->getName()));
        $this->mailer->isHTML(true);
        $this->mailer->Subject = Utils::enc("Create User " . $userinfo->getName());
        $templatePath = __DIR__ . '/email_template.html';
        $templateData = [
            'name' => Utils::enc($userinfo->getNickname()),
            'link' => 'https://example.com/verify',
        ];
        $this->mailer->Body = Utils::renderTemplate($templatePath, $templateData);
        // $this->mailer->send();

        return $newUser->jsonSerialize();
    },
    // updateUser =================================
    'updateUser' => function ($rootValue, $args, $context) {
        $userRepo = $this->em->getRepository(User::class);
        $user = $userRepo->find($args['user']['id']);
        $user->updateParameters($args['user']);
        $this->em->flush();
        return $user->jsonSerialize();
    },
    // deleteUser =================================
    'deleteUser' => function ($rootValue, $args, $context) {
        $userRepo = $this->em->getRepository(User::class);
        $user = $userRepo->find($args['id']);
        $delUser = clone $user;
        $this->em->remove($user);
        $this->em->flush();
        return $delUser->jsonSerialize();
    }
];
