import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from 'common/dtos';
import { UserDto } from 'modules/user/dtos';

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
