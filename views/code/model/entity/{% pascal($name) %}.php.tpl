{% $phpOpen %}

/**
* Part of starter project.
*
* @copyright  Copyright (C) 2021 __ORGANIZATION__.
* @license    __LICENSE__
*/

declare(strict_types=1);

namespace {% $ns %};

use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Metadata\EntityMetadata;

/**
* The {% pascal($name) %} class.
*/
#[Table('{% plural(snake($name)) %}', '{% snake($name) %}')]
class {% pascal($name) %} implements EntityInterface
{
    use EntityTrait;

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }
}
