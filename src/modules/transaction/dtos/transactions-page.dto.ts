import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from 'common/dtos';

import { TransactionDto } from './transaction.dto';

export class TransactionsPageDto {
  @ApiProperty({
    type: TransactionDto,
    isArray: true,
  })
  readonly data: TransactionDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: TransactionDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
