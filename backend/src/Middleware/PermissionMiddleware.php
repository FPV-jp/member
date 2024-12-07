<?php

declare(strict_types=1);

namespace Fpv\Middleware;

use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Token;
use Auth0\SDK\Exception\Auth0Exception;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use GuzzleHttp\Client;

use Fpv\Library\Utils;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class PermissionMiddleware
{
    private SdkConfiguration $config;
    private array $requiredScopes;
    private mixed $settings;

    public function __construct(mixed $settings, SdkConfiguration $config, array $requiredScopes = [])
    {
        $this->settings = $settings;
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

            // Validate token ------------------------------------------
            $token = new Token($this->config, $bearer, Token::TYPE_ACCESS_TOKEN);
            $token->verify();
            $token->validate();

            // Check required scope ------------------------------------
            $decodedToken = $token->toArray();
            $userScopes = explode(' ', $decodedToken['scope'] ?? '');
            foreach ($this->requiredScopes as $scope) {
                if (!in_array($scope, $userScopes, true)) {
                    return Utils::toErrorMessage(403, 'Missing required scope: ' . $scope);
                }
            }

            // Get user info --------------------------------------------
            $client = new Client([
                'base_uri' => $this->settings['auth0']['base'],
            ]);
            $response = $client->request('GET', '/userinfo', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $bearer,
                ]
            ]);
            $responseBody = $response->getBody()->getContents();
            $userinfo = json_decode($responseBody, true);

            // Set request ----------------------------------------------
            $request = $request->withAttribute('token', $decodedToken);
            $request = $request->withAttribute('userinfo', $userinfo);

        } catch (Auth0Exception $e) {
            return Utils::toErrorMessage(403, 'Invalid: ' . $e->getMessage());
        }

        return $handler->handle($request);
    }
}
