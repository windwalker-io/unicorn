<?php

declare(strict_types=1);

namespace Unicorn\Generator\SubCommand;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Unicorn\UnicornPackage;
use Windwalker\Console\CommandWrapper;
use Windwalker\Console\IOInterface;
use Windwalker\Utilities\StrNormalize;

/**
 * The RouteSubCommand class.
 */
#[CommandWrapper(
    description: 'Unicorn admin route.'
)]
class RouteSubCommand extends \Windwalker\Core\Generator\SubCommand\RouteSubCommand
{
    public function configure(Command $command): void
    {
        parent::configure($command);

        $command->addOption(
            'type',
            null,
            InputOption::VALUE_REQUIRED,
            'MVC Template type',
            'admin'
        );
    }

    protected function getBaseDir(): string
    {
        return dirname(UnicornPackage::dir());
    }

    public function execute(IOInterface $io): int
    {
        [, $name] = $this->getNameParts($io);
        $force = $io->getOption('force');
        $type = $io->getOption('type');

        if (!$name) {
            $io->errorStyle()->error('No route name');

            return 255;
        }

        $src = $type === 'admin' ? 'route-admin/*' : 'route-simple/*';

        $this->codeGenerator->from($this->getViewPath($src))
            ->replaceTo(
                $this->getDestPath($io),
                [
                    'name' => StrNormalize::toKebabCase($name),
                    'ns' => StrNormalize::toClassNamespace(
                        $this->getNamespace($io) . '/' . StrNormalize::toPascalCase($name)
                    ),
                ],
                $force
            );

        return 0;
    }
}
