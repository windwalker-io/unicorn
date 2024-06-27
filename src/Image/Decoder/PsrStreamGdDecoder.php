<?php

declare(strict_types=1);

namespace Unicorn\Image\Decoder;

use Intervention\Image\Drivers\Gd\Decoders\BinaryImageDecoder;
use Intervention\Image\Exceptions\DecoderException;
use Intervention\Image\Interfaces\ColorInterface;
use Intervention\Image\Interfaces\ImageInterface;
use Psr\Http\Message\StreamInterface;

class PsrStreamGdDecoder extends BinaryImageDecoder
{
    public function decode(mixed $input): ImageInterface|ColorInterface
    {
        if (!$input instanceof StreamInterface) {
            throw new DecoderException('Unable to decode input');
        }

        $input = (string) $input;

        return parent::decode($input);
    }

    protected function belongsToDriver(object $object): bool
    {
        $driverId = function (object $object): string|bool {
            $id = substr($object::class, 27);
            return strstr($id, "\\", true);
        };
        
        return strtolower($driverId($object)) === 'gd';
    }
}
