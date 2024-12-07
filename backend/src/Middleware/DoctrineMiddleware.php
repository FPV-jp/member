<?php declare(strict_types=1);

namespace Fpv\Middleware;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Platforms\MariaDB1060Platform;
use Doctrine\DBAL\Driver;
use Doctrine\DBAL\ServerVersionProvider;

class MariaDBPlatform extends MariaDB1060Platform {}

class DoctrineMariaDBDriver extends Driver\Middleware\AbstractDriverMiddleware implements Driver
{
    public function getDatabasePlatform(ServerVersionProvider $versionProvider): AbstractPlatform
    {
        return new MariaDBPlatform();
    }
}

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class DoctrineMiddleware implements Driver\Middleware
{
    public function wrap(Driver $driver): Driver
    {
        return new DoctrineMariaDBDriver($driver);
    }
}
