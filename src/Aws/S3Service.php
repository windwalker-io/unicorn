<?php

namespace Unicorn\Aws;

use Aws\CloudFront\CloudFrontClient;
use Aws\Result;
use Aws\S3\S3Client;
use Psr\Http\Message\UriInterface;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\Filesystem\Path;
use Windwalker\Filter\Rule\IPAddress;
use Windwalker\Stream\Stream;
use Windwalker\Uri\Uri;
use Windwalker\Utilities\Str;

use const Windwalker\Stream\READ_ONLY_FROM_BEGIN;

/**
 * The S3Service class.
 *
 * @see    https://aws.amazon.com/tw/documentation/sdk-for-php/
 * @see    https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-s3-2006-03-01.html
 * @see    https://docs.aws.amazon.com/aws-sdk-php/v3/api/class-Aws.S3.S3Client.html
 *
 * @since  1.4
 */
class S3Service
{
    use S3ConstantTrait;

    /**
     * S3Service constructor.
     *
     * @param  S3Client  $client
     * @param  array     $options
     */
    public function __construct(
        protected S3Client $client,
        protected array $options = []
    ) {
    }

    /**
     * getObject
     *
     * @param  array  $args
     *
     * @return  Result
     *
     * @since  1.5.1
     */
    public function getObject(array $args): Result
    {
        return $this->client->getObject($args);
    }

    /**
     * getFile
     *
     * @param  string  $path
     * @param  array   $args
     *
     * @return  Result
     *
     * @since  1.5.1
     */
    public function getFileInfo(string $path, array $args = []): Result
    {
        $args['Key'] = $path;

        return $this->getObject($args);
    }

    /**
     * getPreSignedUrl
     *
     * @param  string                         $path     The file path.
     * @param  int|string|\DateTimeInterface  $expires  Use DateTime syntax, example: `+300seconds`
     * @param  array                          $args     Arguments.
     *
     * @return  UriInterface
     *
     * @since  1.5.1
     */
    public function getPreSignedUrl(
        string $path,
        int|string|\DateTimeInterface $expires,
        array $args = []
    ): UriInterface {
        // Cloudfront
        if (($cdn = $this->getCDNHost()) && strtolower($this->getCDNProvider()) === 'cloudfront') {
            $cfc = new CloudFrontClient(
                [
                    'credentials' => $this->client->getCredentials()->wait(),
                    'region' => $this->client->getRegion(),
                    'version' => 'latest'
                ]
            );

            $url = $cfc->getSignedUrl(
                [
                    'url' => $cdn . '/' . $this->getPathFromFullUrl($path),
                    // Cloudfront expires uses timestamp
                    'expires' => Chronos::wrap($expires)->toUnix(),
                    'private_key' => $this->options['cdn']['private_key'],
                    'key_pair_id' => $this->options['cdn']['key_pair_id']
                ]
            );

            return new Uri($url);
        }

        $args['Key'] = $this->getPathFromFullUrl($path);

        $cmd = $this->client->getCommand('GetObject', $args);

        return $this->client->createPresignedRequest($cmd, $expires)
            ->getUri();
    }

    /**
     * getPreSignedUrlWithFilename
     *
     * @param  string  $path      The file path.
     * @param  string  $expires   Use DateTime syntax, example: `+300seconds`
     * @param  string  $filename  File name to save to local.
     * @param  array   $args      Arguments.
     *
     * @return  \Psr\Http\Message\UriInterface
     *
     * @since  1.5.2
     */
    public function getPreSignedUrlWithFilename(
        string $path,
        string $expires,
        string $filename,
        array $args = []
    ): UriInterface {
        $args['Key'] = $this->getPathFromFullUrl($path);
        $args['ResponseContentDisposition'] = sprintf(
            "attachment; filename*=UTF-8''%s",
            rawurlencode(Path::makeUtf8Safe($filename))
        );

        $cmd = $this->client->getCommand('GetObject', $args);

        return $this->client->createPresignedRequest($cmd, $expires)
            ->getUri();
    }

    /**
     * putObject
     *
     * @param  array  $args
     *
     * @return  Result
     *
     * @since  1.4
     */
    public function putObject(array $args): Result
    {
        return $this->client->putObject($args);
    }

    /**
     * uploadFile
     *
     * @param  string  $file
     * @param  string  $path
     * @param  array   $args
     *
     * @return  Result
     *
     * @since  1.4
     */
    public function uploadFile(string $file, string $path, array $args = []): Result
    {
        $args['Key'] = $path;
        $args['Body'] = $stream = new Stream($file, READ_ONLY_FROM_BEGIN);

        $result = $this->putObject($args);

        $stream->close();
        unset($stream);

        return $result;
    }

    /**
     * uploadFile
     *
     * @param  string|Stream  $data
     * @param  string         $path
     * @param  array          $args
     *
     * @return  Result
     *
     * @since  1.4
     */
    public function uploadFileData($data, string $path, array $args = []): Result
    {
        $args['Key'] = $path;
        $args['Body'] = $data;

        return $this->putObject($args);
    }

    /**
     * deleteObject
     *
     * @param  array  $args
     *
     * @return  Result
     *
     * @since  1.5.1
     */
    public function deleteObject(array $args): Result
    {
        return $this->client->deleteObject($args);
    }

    /**
     * deleteObject
     *
     * @param  string  $path
     * @param  array   $args
     *
     * @return  Result
     *
     * @since  1.4
     */
    public function deleteFile(string $path, array $args = []): Result
    {
        $args['Key'] = $this->getPathFromFullUrl($path);

        return $this->deleteObject($args);
    }

    /**
     * Delete file by URL or full path with subfolder.
     *
     * @param  string  $path
     * @param  array   $args
     *
     * @return  Result
     *
     * @since      1.5.2
     *
     * @deprecated Use deleteFile() directly.
     */
    public function deleteByFullPath(string $path, array $args = []): Result
    {
        $uri = new Uri($path);
        $filePath = ltrim($uri->getPath(), '/');

        $filePath = explode('/', $filePath);

        if (str_starts_with($path, 'https://s3.amazonaws.com')) {
            array_shift($filePath);
        }

        $args['Key'] = implode('/', $filePath);

        if (!isset($args['Bucket'])) {
            $args['Bucket'] = $this->getBucketName();
        }

        return $this->getClient()->deleteObject($args);
    }

    public function listObjects(string $path, array $args = []): \Iterator
    {
        $args['Prefix'] = $path;

        foreach ($this->client->getIterator('ListObjects', $args) as $k => $item) {
            $item['Key'] = Str::removeLeft($item['Key'], $this->getSubfolder());
            $item['Uri'] = $this->getUri($item['Key']);

            yield $k => $item;
        }
    }

    public function exists(string $path, array $args = []): bool
    {
        return $this->client->doesObjectExist(
            $this->getBucketName(),
            $path,
            $args
        );
    }

    /**
     * getPathFromFullUrl
     *
     * @param  string  $url
     *
     * @return  string
     *
     * @since  1.5.5
     */
    public function getPathFromFullUrl(string $url): string
    {
        if (!str_starts_with($url, 'http')) {
            return $url;
        }

        $host = $this->getHost(true, false)->__toString();

        if (str_starts_with($url, $host)) {
            return ltrim(substr($url, strlen($host)), '/');
        }

        $host = $this->getHost(true, true)->__toString();

        if (str_starts_with($url, $host)) {
            return ltrim(substr($url, strlen($host)), '/');
        }

        $host = $this->getCDNHost();

        if ($host && str_starts_with($url, $host)) {
            return ltrim(substr($url, strlen($host)), '/');
        }

        return $url;
    }

    /**
     * command
     *
     * @param  string  $name
     * @param  array   $args
     *
     * @return  Result
     *
     * @since  1.5.1
     */
    public function runCommand(string $name, array $args = []): Result
    {
        $cmd = $this->client->getCommand($name, $args);

        return $this->client->execute($cmd);
    }

    /**
     * getKey
     *
     * @return  string
     *
     * @since  1.4
     */
    public function getKey(): string
    {
        return $this->options['access_key'] ?? '';
    }

    /**
     * getKey
     *
     * @return  string
     *
     * @since  1.4
     */
    public function getSecret(): string
    {
        return $this->options['secret'] ?? '';
    }

    /**
     * getBucket
     *
     * @return  string
     */
    public function getBucketName(): string
    {
        $bucket = $this->options['bucket'] ?? '';

        if (!$bucket) {
            throw new \UnexpectedValueException('Please enter bucket first.');
        }

        return $bucket;
    }

    /**
     * getSubfolder
     *
     * @return  string
     *
     * @since  1.4
     */
    public function getSubfolder(): string
    {
        return (string) ($this->options['subfolder'] ?? '');
    }

    /**
     * getHost
     *
     * @param  bool  $subfolder
     * @param  bool  $pathStyle
     *
     * @return UriInterface
     */
    public function getHost(bool $subfolder = true, bool $pathStyle = false): UriInterface
    {
        $uri = $this->client->getEndpoint();

        $bucket = $this->getBucketName();

        $host = $uri->getHost();

        $isIP = (new IPAddress())->test($host);

        if ($isIP) {
            $pathStyle = true;
        }

        if ($pathStyle || ($uri->getScheme() === 'https' && str_contains($bucket, '.'))) {
            // Use path-style URLs
            $uri = $uri->withPath('/' . $bucket);
        } else {
            // Use virtual-style URLs if haven't been set up already
            if (!str_starts_with($uri->getHost(), $bucket . '.')) {
                $uri = $uri->withHost($bucket . '.' . $uri->getHost());
            }
        }

        if ($subfolder && (string) $this->getSubfolder() !== '') {
            $uri = $uri->withPath(
                Path::clean($uri->getPath() . '/' . $this->getSubfolder(), '/')
            );
        }

        return $uri;
    }

    public function getViewerHost(bool $subfolder = true, bool $pathStyle = false): UriInterface
    {
        $cdn = $this->getCDNHost();

        if ($cdn) {
            return new Uri($cdn);
        }

        return $this->getHost($subfolder, $pathStyle);
    }

    public function getUri(string $path, bool $pathStyle = false): Uri
    {
        return new Uri(
            $this->getViewerHost(true, $pathStyle) . '/' . ltrim($path, '/')
        );
    }

    public function getCDNHost(): ?string
    {
        return $this->options['cdn']['root'] ?? null;
    }

    public function getCDNProvider(): ?string
    {
        return $this->options['cdn']['provider'];
    }

    /**
     * Method to get property S3Client
     *
     * @return  S3Client
     *
     * @since  1.4
     */
    public function getClient(): S3Client
    {
        return $this->client;
    }

    /**
     * Method to set property s3Client
     *
     * @param  S3Client  $client
     *
     * @return  static  Return self to support chaining.
     *
     * @since  1.4
     */
    public function setClient(S3Client $client): self
    {
        $this->client = $client;

        return $this;
    }
}
