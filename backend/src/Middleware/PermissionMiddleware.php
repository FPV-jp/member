<?php

declare(strict_types=1);

namespace Fpv\Middleware;

use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Auth0;
use Auth0\SDK\Token;
use Auth0\SDK\Exception\Auth0Exception;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use Fpv\Library\Utils;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class PermissionMiddleware
{
    private SdkConfiguration $config;
    private array $requiredScopes;

    public function __construct(SdkConfiguration $config, array $requiredScopes = [])
    {
        $this->config = $config;
        $this->requiredScopes = $requiredScopes;
    }

    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return Utils::toErrorMessage(401, 'Missing or invalid Authorization header');
        }
        $bearer = substr($authHeader, 7);

        try {
            $token = new Token($this->config, $bearer, Token::TYPE_ACCESS_TOKEN);
            $token->verify();
            $token->validate();
        } catch (Auth0Exception $e) {
            return Utils::toErrorMessage(403, 'Invalid: ' . $e->getMessage());
        }

        $auth0 = new Auth0($this->config);
        $decodedToken = $auth0->decode($bearer)->toArray();
        $userScopes = explode(' ', $decodedToken['scope'] ?? '');
        foreach ($this->requiredScopes as $scope) {
            if (!in_array($scope, $userScopes, true)) {
                return Utils::toErrorMessage(403, 'Missing required scope: ' . $scope);
            }
        }

        $request = $request->withAttribute('token', $decodedToken);
        return $handler->handle($request);
    }
}
