<?php declare(strict_types=1);

namespace Fpv\Library;

use UMA\DIC\Container;
use UMA\DIC\ServiceProvider;

use Psr\Container\ContainerInterface;

use PHPMailer\PHPMailer\PHPMailer;

// --------------------------------------------------------------------
// full-featured email creation and transfer class
// --------------------------------------------------------------------
final class Mailer implements ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function provide(Container $c): void
    {
        $c->set(PHPMailer::class, static function (ContainerInterface $c): PHPMailer {

            /** @var array $settings */
            $settings = $c->get('settings');

            $mailer = new PHPMailer(true);
            $mailer->isSMTP();
            $mailer->SMTPAuth = true;
            $mailer->Host = $settings['mail']['host'];
            $mailer->Username = $settings['mail']['username'];
            $mailer->Password = $settings['mail']['password'];
            $mailer->Port = 587;
            $mailer->setFrom($settings['mail']['username'], 'FPV Japan');

            return $mailer;
        });
    }
}
