<?php

declare(strict_types=1);

namespace Unicorn\Tests\Upload;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Upload\FileUploadOptions;
use Unicorn\Upload\FileUploadService;
use Symfony\Component\Mime\MimeTypes;
use Windwalker\DI\Container;

/**
 * Tests for the pure helper methods of FileUploadService.
 */
class FileUploadServiceTest extends TestCase
{
    private function createService(array $options = []): FileUploadService
    {
        return new FileUploadService(new Container(), $options, MimeTypes::getDefault());
    }

    #[Test]
    public function normalizeExtension(): void
    {
        self::assertSame('jpg', FileUploadService::normalizeExtension('JPEG'));
        self::assertSame('jpg', FileUploadService::normalizeExtension('jpg'));
        self::assertSame('png', FileUploadService::normalizeExtension('PNG'));
    }

    #[Test]
    public function getUploadPathUsesOptionsDirByDefault(): void
    {
        $service = $this->createService(['dir' => 'uploads']);

        self::assertSame('uploads/foo/bar.jpg', $service->getUploadPath('foo/bar.jpg'));
    }

    #[Test]
    public function getUploadPathWithExplicitDir(): void
    {
        $service = $this->createService(['dir' => 'uploads']);

        self::assertSame('custom/bar.jpg', $service->getUploadPath('bar.jpg', 'jpg', 'custom'));
    }

    #[Test]
    public function getUploadPathCleansDuplicateSlashes(): void
    {
        $service = $this->createService(['dir' => 'uploads/']);

        self::assertSame('uploads/a.png', $service->getUploadPath('/a.png'));
    }

    #[Test]
    public function getUploadPathGeneratesNameWhenPathEmpty(): void
    {
        $service = $this->createService(['dir' => 'uploads']);

        $path = $service->getUploadPath(null);

        self::assertMatchesRegularExpression('/^uploads\/.+\.\{ext\}$/', $path);
    }

    #[Test]
    public function generateFileNameWithPrefix(): void
    {
        $service = $this->createService();

        $name = $service->generateFileName('pre_');

        self::assertStringStartsWith('pre_', $name);
        self::assertGreaterThan(4, strlen($name));
    }

    #[Test]
    public function generateFileNameIsUnique(): void
    {
        $service = $this->createService();

        self::assertNotSame($service->generateFileName(), $service->generateFileName());
    }

    #[Test]
    public function replaceVariablesWithDateParts(): void
    {
        $service = $this->createService();

        $result = $service->replaceVariables('{year}-{month}-{day}');

        self::assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}$/', $result);
    }

    #[Test]
    public function replaceVariablesWithFileParts(): void
    {
        $service = $this->createService();

        $result = $service->replaceVariables(
            '{folder}/{basename}/{ext}/{filename}',
            'photos',
            'cat',
            'jpg',
        );

        self::assertSame('photos/cat/jpg/cat.jpg', $result);
    }

    #[Test]
    public function replaceVariablesRemovesFolderWhenDot(): void
    {
        $service = $this->createService();

        self::assertSame('/x', $service->replaceVariables('{folder}/x', '.'));
    }

    #[Test]
    public function replaceVariablesFilenameRequiresBasenameAndExt(): void
    {
        $service = $this->createService();

        self::assertSame('{filename}', $service->replaceVariables('{filename}', null, 'cat', null));
    }

    #[Test]
    public function replaceVariablesWithPathVars(): void
    {
        $service = $this->createService();
        $service->setPathVar('user', '42');

        self::assertSame('users/42/x', $service->replaceVariables('users/{user}/x'));
    }

    #[Test]
    public function replaceVariablesIgnoresUnknownPlaceholders(): void
    {
        $service = $this->createService();

        self::assertSame('{unknown}', $service->replaceVariables('{unknown}'));
    }

    #[Test]
    public function getMimeTypeByExtension(): void
    {
        $service = $this->createService();

        self::assertSame('image/png', $service->getMimeTypeByExtension('png'));
        self::assertSame('image/jpeg', $service->getMimeTypeByExtension('JPEG'));
    }

    #[Test]
    public function getExtensionByMimeType(): void
    {
        $service = $this->createService();

        self::assertSame('png', $service->getExtensionByMimeType('image/png'));
    }

    #[Test]
    #[TestDox('shouldRedraw() returns true when the destination extension differs')]
    public function shouldRedrawWhenExtensionChanges(): void
    {
        $service = $this->createService();

        self::assertTrue($this->callShouldRedraw($service, 'jpg', 'webp'));
    }

    #[Test]
    #[TestDox('shouldRedraw() returns true by default when resize is enabled')]
    public function shouldRedrawWhenResizeEnabled(): void
    {
        $service = $this->createService();

        self::assertTrue($this->callShouldRedraw($service, 'jpg', '{ext}'));
    }

    #[Test]
    #[TestDox('shouldRedraw() returns false when resize and forceRedraw are both disabled')]
    public function shouldNotRedrawWhenResizeDisabled(): void
    {
        $service = $this->createService();
        $service->setResizeConfig(['enabled' => false]);

        self::assertFalse($this->callShouldRedraw($service, 'jpg', '{ext}'));
    }

    #[Test]
    #[TestDox('shouldRedraw() returns true when forceRedraw is enabled even if resize is disabled')]
    public function shouldRedrawWhenForceRedraw(): void
    {
        $service = $this->createService(['forceRedraw' => true]);
        $service->setResizeConfig(['enabled' => false]);

        self::assertTrue($this->callShouldRedraw($service, 'jpg', '{ext}'));
    }

    #[Test]
    #[TestDox('shouldRedraw() keeps GIF untouched when rawGif is enabled')]
    public function shouldNotRedrawRawGif(): void
    {
        $service = $this->createService(['rawGif' => true]);

        self::assertFalse($this->callShouldRedraw($service, 'gif', '{ext}'));
    }

    #[Test]
    #[TestDox('shouldRedraw() still redraws GIF when rawGif is disabled')]
    public function shouldRedrawGifWithoutRawGif(): void
    {
        $service = $this->createService();

        self::assertTrue($this->callShouldRedraw($service, 'gif', '{ext}'));
    }

    private function callShouldRedraw(FileUploadService $service, string $ext, string $destExt): bool
    {
        $method = new \ReflectionMethod($service, 'shouldRedraw');

        return $method->invoke($service, $ext, $destExt);
    }
}
