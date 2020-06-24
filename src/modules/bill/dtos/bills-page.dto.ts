import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from 'common/dtos';

import { BillDto } from './bill.dto';

export class BillsPageDto {
  @ApiProperty({
    type: BillDto,
    isArray: true,
  })
  readonly data: BillDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: BillDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
