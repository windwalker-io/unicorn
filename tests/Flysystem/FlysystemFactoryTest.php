<?php

declare(strict_types=1);

namespace Unicorn\Tests\Flysystem;

use Aws\S3\S3Client;
use League\Flysystem\AwsS3V3\AwsS3V3Adapter;
use League\Flysystem\AwsS3V3\PortableVisibilityConverter;
use League\Flysystem\PathPrefixer;
use League\Flysystem\Visibility;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use ReflectionProperty;
use Unicorn\Flysystem\FlysystemFactory;
use Windwalker\DI\Container;

/**
 * The FlysystemFactoryTest class.
 */
class FlysystemFactoryTest extends TestCase
{
    protected Container $container;

    protected FlysystemFactory $factory;

    protected function setUp(): void
    {
        $this->container = new Container();
        $this->container->setParameters([
            'storage' => [
                's3' => [
                    'default_region' => 'ap-northeast-1',
                ],
            ],
        ]);

        $this->factory = new FlysystemFactory($this->container);
    }

    #[Test]
    public function s3v3AdapterReturnsAdapterWithBucket(): void
    {
        $adapter = $this->factory->s3v3Adapter([
            'access_key' => 'AKIDTEST',
            'secret' => 'secret',
            'bucket' => 'my-bucket',
        ]);

        $this->assertInstanceOf(AwsS3V3Adapter::class, $adapter);
        $this->assertSame('my-bucket', $this->prop($adapter, 'bucket'));
    }

    #[Test]
    public function s3v3AdapterDefaultsRegionFromContainerParams(): void
    {
        $adapter = $this->factory->s3v3Adapter([
            'access_key' => 'AKIDTEST',
            'secret' => 'secret',
            'bucket' => 'my-bucket',
        ]);

        /** @var S3Client $client */
        $client = $this->prop($adapter, 'client');

        $this->assertInstanceOf(S3Client::class, $client);
        $this->assertSame('ap-northeast-1', $client->getRegion());
    }

    #[Test]
    public function s3v3AdapterExplicitRegionOverridesDefault(): void
    {
        $adapter = $this->factory->s3v3Adapter([
            'access_key' => 'AKIDTEST',
            'secret' => 'secret',
            'bucket' => 'my-bucket',
            'region' => 'us-east-1',
        ]);

        /** @var S3Client $client */
        $client = $this->prop($adapter, 'client');

        $this->assertSame('us-east-1', $client->getRegion());
    }

    #[Test]
    public function s3v3AdapterUsesSubfolderAsPrefix(): void
    {
        $adapter = $this->factory->s3v3Adapter([
            'access_key' => 'AKIDTEST',
            'secret' => 'secret',
            'bucket' => 'my-bucket',
            'subfolder' => 'uploads',
        ]);

        $this->assertSame('uploads/file.txt', $this->prefixer($adapter)->prefixPath('file.txt'));
    }

    #[Test]
    public function s3v3AdapterDefaultsToEmptyBucketAndPrefix(): void
    {
        $adapter = $this->factory->s3v3Adapter([
            'access_key' => 'AKIDTEST',
            'secret' => 'secret',
        ]);

        $this->assertSame('', $this->prop($adapter, 'bucket'));
        $this->assertSame('file.txt', $this->prefixer($adapter)->prefixPath('file.txt'));
    }

    #[Test]
    public function s3v3AdapterUsesPublicVisibilityByDefault(): void
    {
        $adapter = $this->factory->s3v3Adapter([
            'access_key' => 'AKIDTEST',
            'secret' => 'secret',
            'bucket' => 'my-bucket',
        ]);

        /** @var PortableVisibilityConverter $converter */
        $converter = $this->prop($adapter, 'visibility');

        $this->assertSame('public-read', $converter->visibilityToAcl(Visibility::PUBLIC));
    }

    #[Test]
    public function s3v3AdapterUsesPrivateVisibilityWhenAclIsPrivate(): void
    {
        $adapter = $this->factory->s3v3Adapter([
            'access_key' => 'AKIDTEST',
            'secret' => 'secret',
            'bucket' => 'my-bucket',
            'acl' => Visibility::PRIVATE,
        ]);

        /** @var PortableVisibilityConverter $converter */
        $converter = $this->prop($adapter, 'visibility');

        $this->assertSame('private', $converter->visibilityToAcl(Visibility::PRIVATE));
    }

    protected function prop(object $object, string $name): mixed
    {
        $ref = new ReflectionProperty($object, $name);

        return $ref->getValue($object);
    }

    protected function prefixer(AwsS3V3Adapter $adapter): PathPrefixer
    {
        /** @var PathPrefixer $prefixer */
        $prefixer = $this->prop($adapter, 'prefixer');

        return $prefixer;
    }
}
