<?php declare(strict_types=1);

// middleware.php

namespace Fpv\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

use Auth0\SDK\Token;
use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Exception\Auth0Exception;

use Nyholm\Psr7\Response;

use Doctrine\DBAL\Driver\Middleware;
use Doctrine\DBAL\Driver\Connection;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class CorsMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    }
}

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class PermissionMiddleware
{
    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $bearer = $this->getBearer($request);
        if ($bearer == null) {
            return new Response(403, ['Content-Type' => 'application/json'], json_encode(['error' => 'Authorization token required']));
        }

        try {
            // $token = $this->validateToken($bearer, Token::TYPE_ACCESS_TOKEN);
            $token = $this->validateToken($bearer, Token::TYPE_ID_TOKEN);

            $request = $request->withAttribute('token', $token->toArray());
        } catch (Auth0Exception $e) {
            return new Response(403, ['Content-Type' => 'application/json'], json_encode(['error' => 'Auth0 Token Validation Error: ' . $e->getMessage()]));
        }

        return $handler->handle($request);
    }

    public function getBearer(ServerRequestInterface $request): ?string
    {
        if ($request->hasHeader('Authorization')) {
            $authorizationHeader = $request->getHeaderLine('Authorization');
            $tokenParts = explode(' ', $authorizationHeader);
            if (count($tokenParts) === 2 && $tokenParts[0] === 'Bearer') {
                return $tokenParts[1];
            }
        }
        return null;
    }

    public function validateToken(string $jwt, int $type)
    {
        $auth0Configuration = [
            'domain' => $_ENV['AUTH0_DOMAIN'],
            'clientId' => $_ENV['AUTH0_CLIENT_ID'],
            'cookieSecret' => bin2hex(random_bytes(32)),
        ];
        $config = new SdkConfiguration($auth0Configuration);
        $token = new Token($config, $jwt, $type);
        $token->verify();
        $token->validate();
        return $token;
    }

}
