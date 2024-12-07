<?php

declare(strict_types=1);

use Fpv\Domain\User;

use Fpv\Library\Utils;

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
        $userinfo = $context['userinfo'];

        $newUser = new User($args['user']['email'], $args['user']['password']);
        $this->em->persist($newUser);
        $this->em->flush();

        // Send mail ----------------------------------------
        $this->mailer->addAddress($userinfo['email'], Utils::enc($userinfo['name']));
        $this->mailer->isHTML(true);
        $this->mailer->Subject = Utils::enc("createUser " . $userinfo['given_name']);
        $templatePath = __DIR__ . '/email_template.html';
        $templateData = [
            'name' => Utils::enc($userinfo['nickname']),
            'link' => 'https://example.com/verify',
        ];
        $this->mailer->Body = Utils::renderTemplate($templatePath, $templateData);
        $this->mailer->send();

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
