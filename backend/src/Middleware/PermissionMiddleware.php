<?php

declare(strict_types=1);

namespace Fpv\Middleware;

use UMA\DIC\Container;

use Doctrine\ORM\EntityManager;

use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Token;
use Auth0\SDK\Exception\Auth0Exception;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

use GuzzleHttp\Client;

use Fpv\Library\Utils;

use Fpv\Domain\Entity\UserInfo;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class PermissionMiddleware
{
    private Container $c;
    private SdkConfiguration $config;
    private Client $client;
    private array $requiredScopes;

    public function __construct(Container $c, mixed $auth0, array $requiredScopes = [])
    {
        $this->c = $c;
        $this->config = new SdkConfiguration([
            'domain' => $auth0['domain'],
            'clientId' => $auth0['clientId'],
            'audience' => [
                $auth0['audience'],
                $auth0['base'],
            ],
            'tokenAlgorithm' => 'RS256',
            'cookieSecret' => bin2hex(random_bytes(32)),
        ]);

        $this->client = new Client([
            'base_uri' => $auth0['base'],
        ]);

        $this->requiredScopes = $requiredScopes;
    }

    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return Utils::toResponse(401, ['error' => 'Missing or invalid Authorization header']);
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
                    return Utils::toResponse(403, ['error' => 'Missing required scope: ' . $scope]);
                }
            }

            // Get userInfo --------------------------------------------
            $em = $this->c->get(EntityManager::class);
            $userInfoRepo = $em->getRepository(UserInfo::class);
            $userInfo = $userInfoRepo->findOneBy(['sub' => $decodedToken['sub']]);
            if ($userInfo == null) {
                $response = $this->client->request('GET', '/userinfo', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $bearer,
                    ],
                ]);
                $responseBody = $response->getBody()->getContents();
                $userInfo = new UserInfo(json_decode($responseBody, true));
                $em->persist($userInfo);
                $em->flush(); // save userInfo
            }

            // Set request ----------------------------------------------
            $request = $request->withAttribute('token', $decodedToken);
            $request = $request->withAttribute('userinfo', $userInfo);
        } catch (Auth0Exception $e) {
            return Utils::toResponse(403, ['error' => 'Invalid: ' . $e->getMessage()]);
        }

        return $handler->handle($request);
    }
}
