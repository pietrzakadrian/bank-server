import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from 'common/dtos';
import { MessageDto } from 'modules/message/dtos';

export class MessagesPageDto {
  @ApiProperty({
    type: MessageDto,
    isArray: true,
  })
  readonly data: MessageDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: MessageDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
