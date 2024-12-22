<?php declare(strict_types=1);

use Fpv\Domain\Entity\MediaLibrary;

return [
    'medialibrary' => function ($rootValue, $args, $context) {
        $medialibrary = $this->em->getRepository(MediaLibrary::class)->find($args['id']);
        return $medialibrary->jsonSerialize();
    },
    'allMediaLibraries' => function ($rootValue, $args, $context) {
        // $token = $context['token'];
        // error_log(print_r($token, true));
        $medialibrarys = $this->em->getRepository(MediaLibrary::class)->findAll();
        $medialibraryArray = [];
        foreach ($medialibrarys as $medialibrary) {
            $medialibraryArray[] = $medialibrary->jsonSerialize();
        }
        return $medialibraryArray;
    },
    'createMediaLibrary' => function ($rootValue, $args, $context) {
        $newMediaLibrary = new MediaLibrary($args['createMediaLibraryInput'], $context['token']);
        $this->em->persist($newMediaLibrary);
        $this->em->flush();
        // error_log(print_r($newMediaLibrary->jsonSerialize(), true));
        return $newMediaLibrary->jsonSerialize();
    },
    'updateMediaLibrary' => function ($rootValue, $args, $context) {
        $medialibrary = $this->em->getRepository(MediaLibrary::class)->find($args['id']);
        $medialibrary->updateParameters($args);
        $this->em->flush();
        return $medialibrary->jsonSerialize();
    },
    'deleteMediaLibrary' => function ($rootValue, $args, $context) {
        $medialibrary = $this->em->getRepository(MediaLibrary::class)->find($args['id']);
        $this->em->remove($medialibrary);
        $this->em->flush();
        return $medialibrary->jsonSerialize();
    }
];