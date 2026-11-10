<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use Unicorn\Provider\StorageProvider;
use Unicorn\Upload\FileUploadFactory;
use Unicorn\Upload\FileUploadService;
use Windwalker\Core\Application\PathResolver;
use Windwalker\Core\Runtime\Config;
use Windwalker\DI\Container;

/**
 * Tests for FileUploadFactory profile resolution.
 */
class FileUploadFactoryTest extends TestCase
{
    private function createFactory(array $fileUploadConfig): FileUploadFactory
    {
        $config = new Config(['unicorn' => ['file_upload' => $fileUploadConfig]]);
        $container = new Container();
        new StorageProvider()->register($container);
        $resolver = $this->createStub(PathResolver::class);
        $resolver->method('resolve')->willReturn(sys_get_temp_dir());
        $container->set(PathResolver::class, $resolver);

        return new FileUploadFactory($config, $container);
    }

    #[Test]
    #[TestDox('create() builds a FileUploadService from the named profile array')]
    public function createFromArrayProfile(): void
    {
        $factory = $this->createFactory([
            'default' => 'avatar',
            'profiles' => [
                'avatar' => ['dir' => 'avatars', 'storage' => 'public'],
            ],
        ]);

        $service = $factory->create('avatar');

        self::assertInstanceOf(FileUploadService::class, $service);
        self::assertSame('avatars', $service->options->dir);
        self::assertSame('public', $service->options->storage);
    }

    #[Test]
    #[TestDox('create() uses the default profile when no name is given')]
    public function createUsesDefaultProfile(): void
    {
        $factory = $this->createFactory([
            'default' => 'docs',
            'profiles' => [
                'docs' => ['dir' => 'documents'],
            ],
        ]);

        $service = $factory->create();

        self::assertSame('documents', $service->options->dir);
    }

    #[Test]
    #[TestDox('create() resolves a Closure profile through the container')]
    public function createWithClosureProfile(): void
    {
        $factory = $this->createFactory([
            'default' => 'dynamic',
            'profiles' => [
                'dynamic' => static fn() => ['dir' => 'dynamic-dir'],
            ],
        ]);

        $service = $factory->create('dynamic');

        self::assertSame('dynamic-dir', $service->options->dir);
    }

    #[Test]
    #[TestDox('create() throws when the profile does not exist')]
    public function createThrowsForUnknownProfile(): void
    {
        $factory = $this->createFactory([
            'default' => 'missing',
            'profiles' => [],
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('profile "missing" not found');

        $factory->create('missing');
    }

    #[Test]
    #[TestDox('create() throws when no name is given and no default is configured')]
    public function createThrowsWithoutName(): void
    {
        $factory = $this->createFactory(['profiles' => []]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Empty definition name.');

        $factory->create();
    }
}
