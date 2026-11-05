<?php

declare(strict_types=1);

namespace Unicorn\Tests\Image;

use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Unicorn\Image\ImagePlaceholder;
use Windwalker\Core\Asset\AssetService;

/**
 * The ImagePlaceholderTest class.
 */
class ImagePlaceholderTest extends TestCase
{
    protected AssetService $asset;

    protected ImagePlaceholder $placeholder;

    protected function setUp(): void
    {
        $this->asset = $this->createMock(AssetService::class);
        $this->placeholder = new ImagePlaceholder($this->asset);
    }

    #[Test]
    public function placeholderUsesDefaultRatioImageFromUnicornPackage(): void
    {
        $this->asset->expects($this->once())
            ->method('handleUri')
            ->with('@unicorn/../images/placeholder/image-4x3.png', 'root')
            ->willReturn('/assets/image-4x3.png');

        self::assertSame('/assets/image-4x3.png', $this->placeholder->placeholder());
    }

    #[Test]
    public function placeholderNormalizesColonRatioToX(): void
    {
        $this->asset->expects($this->once())
            ->method('handleUri')
            ->with('@unicorn/../images/placeholder/image-16x9.png', 'root')
            ->willReturn('/assets/image-16x9.png');

        self::assertSame('/assets/image-16x9.png', $this->placeholder->placeholder('16:9'));
    }

    #[Test]
    public function placeholderUsesCustomImageWhenSet(): void
    {
        $this->placeholder->setImage('4:3', '@custom/foo.png');

        $this->asset->expects($this->once())
            ->method('handleUri')
            ->with('@custom/foo.png')
            ->willReturn('/custom/foo.png');

        self::assertSame('/custom/foo.png', $this->placeholder->placeholder('4x3'));
    }

    #[Test]
    public function magicSquareMethodReturnsSquarePlaceholder(): void
    {
        $this->asset->expects($this->once())
            ->method('handleUri')
            ->with('@unicorn/../images/placeholder/image-1x1.png', 'root')
            ->willReturn('/assets/image-1x1.png');

        self::assertSame('/assets/image-1x1.png', $this->placeholder->placeholderSquare());
    }

    #[Test]
    public function magicMethodAcceptsTo4x3Alias(): void
    {
        $this->asset->expects($this->once())
            ->method('handleUri')
            ->with('@unicorn/../images/placeholder/image-4x3.png', 'root')
            ->willReturn('/assets/image-4x3.png');

        self::assertSame('/assets/image-4x3.png', $this->placeholder->placeholder4to3());
    }

    #[Test]
    public function setImageWithNullRemovesCustomImage(): void
    {
        $this->placeholder->setImage('16:9', '@custom/wide.png');
        $this->placeholder->setImage('16:9', null);

        self::assertSame([], $this->placeholder->getImageMap());

        $this->asset->expects($this->once())
            ->method('handleUri')
            ->with('@unicorn/../images/placeholder/image-16x9.png', 'root')
            ->willReturn('/assets/image-16x9.png');

        self::assertSame('/assets/image-16x9.png', $this->placeholder->placeholder('16:9'));
    }

    #[Test]
    #[AllowMockObjectsWithoutExpectations]
    public function magicMethodWithUnknownSuffixThrows(): void
    {
        $this->expectException(\UnhandledMatchError::class);

        $this->placeholder->placeholder99x99();
    }
}
