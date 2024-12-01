<?php declare(strict_types=1);

namespace Fpv\Middleware;

use Doctrine\DBAL\Platforms\MariaDB1060Platform ;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Driver;
use Doctrine\DBAL\Driver\Middleware;
use Doctrine\DBAL\Driver\Middleware\AbstractDriverMiddleware;
use Doctrine\DBAL\ServerVersionProvider;

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class MariaDBPlatform extends MariaDB1060Platform {}

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class DoctrineMariaDBDriver extends AbstractDriverMiddleware implements Driver
{
    public function getDatabasePlatform(ServerVersionProvider $versionProvider): AbstractPlatform
    {
        return new MariaDBPlatform();
    }
}

// --------------------------------------------------------------------
// 
// --------------------------------------------------------------------
class DoctrineMiddleware implements Middleware
{
    public function wrap(Driver $driver): Driver
    {
        return new DoctrineMariaDBDriver($driver);
    }
}
