<?php declare(strict_types=1);

namespace Fpv\Middleware;

use Doctrine\DBAL\Platforms;
use Doctrine\DBAL\Driver;
use Doctrine\DBAL\ServerVersionProvider;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class MariaDBPlatform extends Platforms\MariaDB1060Platform {}

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class DoctrineMariaDBDriver extends Driver\Middleware\AbstractDriverMiddleware implements Driver
{
    public function getDatabasePlatform(ServerVersionProvider $versionProvider): Platforms\AbstractPlatform
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
