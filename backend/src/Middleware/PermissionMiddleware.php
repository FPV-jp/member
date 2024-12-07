<?php

declare(strict_types=1);

namespace Fpv\Middleware;

use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use Fpv\Library\Utils;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class PermissionMiddleware
{
    private Auth0 $auth0;
    private array $requiredScopes;

    public function __construct(array $requiredScopes = [])
    {
        $config = new SdkConfiguration([
            'domain' => $_ENV['AUTH0_DOMAIN'],
            'clientId' => $_ENV['AUTH0_CLIENT_ID'],
            'audience' => 'https://member.fpv.jp/users', //$_ENV['AUTH0_AUDIENCE'],
            'tokenAlgorithm' => 'RS256',
        ]);
        $this->auth0 = new Auth0($config);
        $this->requiredScopes = $requiredScopes;
    }

    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            $authHeader = $request->getHeaderLine('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return Utils::toErrorMessage(401, 'Missing or invalid Authorization header');
            }
            $token = substr($authHeader, 7);
            $decodedToken = $this->auth0->decode($token);
            $userScopes = explode(' ', $decodedToken->scope ?? '');
            foreach ($this->requiredScopes as $scope) {
                if (!in_array($scope, $userScopes, true)) {
                    return Utils::toErrorMessage(403, 'Missing required scope: ' . $scope);
                }
            }
            return $handler->handle($request);
        } catch (\Exception $e) {
            return Utils::toErrorMessage(401, 'Unauthorized: ' . $e->getMessage());
        }
    }
}

// use Psr\Http\Message\ServerRequestInterface;
// use Psr\Http\Server\RequestHandlerInterface;

// use Auth0\SDK\Exception\Auth0Exception;
// use Auth0\SDK\Configuration\SdkConfiguration;
// use Auth0\SDK\Token;

// use Psr\Http\Message\ResponseInterface;

// use Fpv\Library\Utils;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
// class PermissionMiddleware
// {
//     public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
//     {
//         $bearer = $this->getBearer($request);
//         if ($bearer == null) {
//             return Utils::toResponse(403, ['error' => 'Authorization token required']);
//         }
//         try {
//             $token = $this->validateToken($bearer, Token::TYPE_ACCESS_TOKEN);
//             $request = $request->withAttribute('token', $token->toArray());
//         } catch (Auth0Exception $e) {
//             return Utils::toResponse(403, ['error' => 'Auth0 Token Validation Error: ' . $e->getMessage()]);
//         }
//         return $handler->handle($request);
//     }

//     public function getBearer(ServerRequestInterface $request): ?string
//     {
//         if ($request->hasHeader('Authorization')) {
//             $authorizationHeader = $request->getHeaderLine('Authorization');
//             $tokenParts = explode(' ', $authorizationHeader);
//             if (count($tokenParts) === 2 && $tokenParts[0] === 'Bearer') {
//                 return $tokenParts[1];
//             }
//         }
//         return null;
//     }

//     public function validateToken(string $jwt, int $type)
//     {
//         $auth0Configuration = [
//             'domain' => $_ENV['AUTH0_DOMAIN'],
//             'clientId' => $_ENV['AUTH0_CLIENT_ID'],
//             'cookieSecret' => bin2hex(random_bytes(32)),
//         ];
//         $config = new SdkConfiguration($auth0Configuration);
//         $token = new Token($config, $jwt, $type);
//         $token->verify();
//         $token->validate();
//         return $token;
//     }

// }
