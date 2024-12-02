<?php declare(strict_types=1);

namespace Fpv\GraphQL;

use Doctrine\ORM\EntityManager;

use Aws\S3\S3Client;
use Cloudinary\Api\Admin\AdminApi;
use PHPMailer\PHPMailer\PHPMailer;
use Faker\Generator;

use Nyholm\Psr7\Response;
use Nyholm\Psr7\Stream;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use GraphQL\GraphQL;
use GraphQL\Utils\BuildSchema;
use GraphQL\Error\FormattedError;

use Slim\Exception\HttpInternalServerErrorException;

use function json_encode;

final class GraphQLHandler implements RequestHandlerInterface
{
    private EntityManager $em;
    private AdminApi $cloudinary;
    private PHPMailer $mailer;
    private S3Client $wasabi;

    private Generator $faker;

    public function __construct(EntityManager $em, AdminApi $cloudinary, PHPMailer $mailer, S3Client $wasabi, Generator $faker)
    {
        $this->em = $em;
        $this->cloudinary = $cloudinary;
        $this->mailer = $mailer;
        $this->wasabi = $wasabi;
        $this->faker = $faker;
    }
    private function buildSchema()
    {
        $schemaFiles = [
            // __DIR__ . '/Cloudinary/schema.graphql',
            // __DIR__ . '/Wasabi/schema.graphql',

            __DIR__ . '/User.graphql',
            // __DIR__ . '/EventSchedule/schema.graphql',
            // __DIR__ . '/FlightPoint/schema.graphql',
            // __DIR__ . '/MediaLibrary/schema.graphql',
            // __DIR__ . '/OpenChat/schema.graphql',

            __DIR__ . '/schema.graphql',
        ];

        $schemaString = '';
        foreach ($schemaFiles as $file) {
            $schemaString .= file_get_contents($file) . PHP_EOL;
        }
        return BuildSchema::build($schemaString);
    }

    private function rootValue()
    {
        $resolverFiles = [
            // __DIR__ . '/Cloudinary/resolver.php',
            // __DIR__ . '/Wasabi/resolver.php',

            __DIR__ . '/User.php',
            // __DIR__ . '/EventSchedule/resolver.php',
            // __DIR__ . '/FlightPoint/resolver.php',
            // __DIR__ . '/MediaLibrary/resolver.php',
            // __DIR__ . '/OpenChat/resolver.php',

        ];
        $rootValue = [];
        foreach ($resolverFiles as $file) {
            $rootValue = array_merge($rootValue, require_once $file);
        }
        return $rootValue;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $rawInput = file_get_contents('php://input');
        if ($rawInput === false) {
            throw new HttpInternalServerErrorException($request, 'Failed to get php://input');
        }

        try {
            $input = json_decode($rawInput, true);
            $schema = $this->buildSchema();
            $source = $input['query'];
            $rootValue = $this->rootValue();
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
            $body = Stream::create(json_encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
            return new Response(200, ['Content-Type' => 'application/json'], $body);

        } catch (\Exception $e) {
            $body = Stream::create(json_encode([
                'errors' => [FormattedError::createFromException($e)]
            ], JSON_PRETTY_PRINT) . PHP_EOL);
            return new Response(500, ['Content-Type' => 'application/json'], $body);
        }
    }
}
