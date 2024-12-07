<?php

declare(strict_types=1);

namespace Fpv\GraphQL;

use Doctrine\ORM\EntityManager;

use Slim\Exception\HttpInternalServerErrorException;

use Nyholm\Psr7\Response;
use Nyholm\Psr7\Stream;

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

use function json_encode;

final class GraphQLHandler implements RequestHandlerInterface
{
    private EntityManager $em;
    private AdminApi $cloudinary;
    private PHPMailer $mailer;
    private S3Client $wasabi;

    private Generator $faker;

    private array $files = [
        'User',
        // 'Cloudinary',
        // 'Wasabi',
        // 'EventSchedule',
        // 'FlightPoint',
        // 'MediaLibrary',
        // 'OpenChat',
    ];

    public function __construct(EntityManager $em, AdminApi $cloudinary, PHPMailer $mailer, S3Client $wasabi, Generator $faker)
    {
        $this->em = $em;
        $this->cloudinary = $cloudinary;
        $this->mailer = $mailer;
        $this->wasabi = $wasabi;
        $this->faker = $faker;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $rawInput = file_get_contents('php://input');
        if ($rawInput === false) {
            throw new HttpInternalServerErrorException($request, 'Failed to get php://input');
        }

        $headers = ['Content-Type' => 'application/json'];

        try {
            $input = json_decode($rawInput, true);

            // schema ------------------------------------
            $schemaString = file_get_contents(__DIR__ . '/schema.graphql') . PHP_EOL;
            foreach ($this->files as $schema) {
                $schemaString .= file_get_contents(__DIR__ . '/Schema//' . $schema . '.graphql') . PHP_EOL;
            }
            $schema = BuildSchema::build($schemaString);

            $source = $input['query'];

            // Resolver ----------------------------------
            $rootValue = [];
            foreach ($this->files as $resolver) {
                $rootValue = array_merge($rootValue, require_once __DIR__ . '/Resolver//' . $resolver . 'Resolver.php');
            }
            return $rootValue;

            $contextValue = ['token' => $request->getAttribute('token')];
            $variableValues = $input['variables'] ?? null;

            $result = GraphQL::executeQuery(
                $schema,
                $source,
                $rootValue,
                $contextValue,
                $variableValues,
                // string $operationName = null,
                // callable $fieldResolver = null,
                // array $validationRules = null
            );

            $body = json_encode($result, JSON_PRETTY_PRINT) . PHP_EOL;
            return new Response(200, $headers, Stream::create($body));
        } catch (\Exception $e) {
            $err = ['errors' => [FormattedError::createFromException($e)]];

            $body = json_encode($err, JSON_PRETTY_PRINT) . PHP_EOL;
            return new Response(500, $headers, Stream::create($body));
        }
    }
}
