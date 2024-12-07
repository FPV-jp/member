<?php

declare(strict_types=1);

namespace Fpv\GraphQL;

use Doctrine\ORM\EntityManager;

use Slim\Exception\HttpInternalServerErrorException;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use GraphQL\GraphQL;
use GraphQL\Utils\BuildSchema;
use GraphQL\Error\FormattedError;

use Aws\S3\S3Client;
use Cloudinary\Api\Admin\AdminApi;
use PHPMailer\PHPMailer\PHPMailer;
use Faker\Generator;

use Fpv\Library\Utils;

final class GraphQLHandler implements RequestHandlerInterface
{
    private EntityManager $em;
    private PHPMailer $mailer;
    private S3Client $wasabi;
    private Generator $faker;

    public function __construct(EntityManager $em, PHPMailer $mailer, S3Client $wasabi, Generator $faker)
    {
        $this->em = $em;
        $this->mailer = $mailer;
        $this->wasabi = $wasabi;
        $this->faker = $faker;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        Utils::requestLog();

        $rawInput = file_get_contents('php://input');
        if ($rawInput === false) {
            throw new HttpInternalServerErrorException($request, 'Failed to get php://input');
        }

        $files = [
            'User',
            // 'Cloudinary',
            // 'Wasabi',
            // 'EventSchedule',
            // 'FlightPoint',
            // 'MediaLibrary',
            // 'OpenChat',
        ];

        $input = json_decode($rawInput, true);
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
                // string $operationName = null,
                // callable $fieldResolver = null,
                // array $validationRules = null
            );
            return Utils::toResponse(200, $result);
        } catch (\Exception $e) {
            $err = ['errors' => [FormattedError::createFromException($e)]];
            return Utils::toResponse(500, $err);
        }
    }
}
