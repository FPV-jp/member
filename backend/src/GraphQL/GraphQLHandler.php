<?php

declare(strict_types=1);

namespace Fpv\GraphQL;

use Doctrine\ORM\EntityManager;

use Slim\Exception\HttpInternalServerErrorException;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use GraphQL\GraphQL;
use GraphQL\Utils\BuildSchema;
use GraphQL\Error\FormattedError;

use Aws\S3\S3Client;
use PHPMailer\PHPMailer\PHPMailer;
use Faker\Generator;
use Faker\Factory;

use Fpv\Library\Utils;

final class GraphQLHandler
{

    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    private EntityManager $em;
    private PHPMailer $mailer;
    private S3Client $wasabi;
    private Generator $faker;

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {

        Utils::requestLog($request);
        $input = json_decode($request->getBody()->getContents(), true);
        Utils::argsDump($input);

        $this->em = $this->container->get(EntityManager::class);
        $this->mailer = $this->container->get(PHPMailer::class);
        $this->wasabi = $this->container->get(S3Client::class);
        $this->faker = Factory::create();

        $files = [
            'User',
            // 'Cloudinary',
            // 'Wasabi',
            // 'EventSchedule',
            // 'FlightPoint',
            // 'MediaLibrary',
            // 'OpenChat',
        ];

        $schemaString = file_get_contents(__DIR__ . '/schema.graphql') . PHP_EOL;
        foreach ($files as $schema) {
            $schemaString .= file_get_contents(__DIR__ . '/Schema//' . $schema . '.graphql') . PHP_EOL;
        }

        $rootValue = [];
        foreach ($files as $resolver) {
            $rootValue = array_merge($rootValue, require_once __DIR__ . '/Resolver//' . $resolver . 'Resolver.php');
        }

        try {
            $result = GraphQL::executeQuery(
                BuildSchema::build($schemaString),
                $input['query'],
                $rootValue,
                ['token' => $request->getAttribute('token'), 'userinfo' => $request->getAttribute('userinfo')],
                $input['variables'] ?? null,
            );
            return Utils::toResponse(200, $result);
        } catch (\Exception $e) {
            $err = ['errors' => [FormattedError::createFromException($e)]];
            return Utils::toResponse(500, $err);
        }
    }
}
