<?php

declare(strict_types=1);

namespace Fpv\GraphQL;

use Doctrine\ORM\EntityManager;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use GraphQL\GraphQL;
use GraphQL\Utils\BuildSchema;
use GraphQL\Error\DebugFlag;

use Aws\S3\S3Client;
use PHPMailer\PHPMailer\PHPMailer;
use Faker\Generator;
use Faker\Factory;

use Fpv\Library\Utils;

const GRAPHQLFILES = [
    'User',
    // 'Wasabi',
    // 'EventSchedule',
    // 'FlightPoint',
    // 'MediaLibrary',
    // 'OpenChat',
];

final class GraphQLHandler
{

    private $container;
    protected EntityManager $em;
    protected PHPMailer $mailer;
    protected S3Client $wasabi;
    protected Generator $faker;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->em = $this->container->get(EntityManager::class);
        $this->mailer = $this->container->get(PHPMailer::class);
        $this->wasabi = $this->container->get(S3Client::class);
        $this->faker = Factory::create();

    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $schemaString = file_get_contents(__DIR__ . '/schema.graphql') . PHP_EOL;
        foreach (GRAPHQLFILES as $schema) {
            $schemaString .= file_get_contents(__DIR__ . '/Schema//' . $schema . '.graphql') . PHP_EOL;
        }

        $rootValue = [];
        foreach (GRAPHQLFILES as $resolver) {
            $rootValue = array_merge($rootValue, require_once __DIR__ . '/Resolver//' . $resolver . 'Resolver.php');
        }

        $input = json_decode($request->getBody()->getContents(), true);
        Utils::argsDump($input);

        $result = GraphQL::executeQuery(
            BuildSchema::build($schemaString),
            $input['query'],
            $rootValue,
            ['token' => $request->getAttribute('token'), 'userinfo' => $request->getAttribute('userinfo')],
            $input['variables'] ?? null,
        );
        $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE | DebugFlag::RETHROW_INTERNAL_EXCEPTIONS);
        return Utils::toResponse(200, $result);
    }
}
