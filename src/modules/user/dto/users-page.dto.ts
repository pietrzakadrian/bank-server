import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from 'common/dto';
import { UserDto } from 'modules/user/dto';

export class UsersPageDto {
    @ApiProperty({
        type: UserDto,
        isArray: true,
    })
    readonly data: UserDto[];

    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: UserDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
