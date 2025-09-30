<?php

declare(strict_types=1);

namespace Unicorn\Aws;

trait S3ConstantTrait
{
    public const string ACL_PRIVATE = 'private';

    public const string ACL_PUBLIC_READ = 'public-read';

    public const string ACL_PUBLIC_READ_WRITE = 'public-read-write';

    public const string ACL_AUTHENTICATED_READ = 'authenticated-read';

    public const string STORAGE_CLASS_STANDARD = 'STANDARD';

    public const string STORAGE_CLASS_RRS = 'REDUCED_REDUNDANCY';

    public const string SSE_NONE = '';

    public const string SSE_AES256 = 'AES256';
}
