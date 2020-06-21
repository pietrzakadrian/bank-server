'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AbstractDto } from 'common/dtos';
import { BillEntity } from 'modules/bill/entities';
import { CurrencyDto } from 'modules/currency/dtos';
import { UserDto } from 'modules/user/dtos';

export class BillDto extends AbstractDto {
  @ApiProperty()
  readonly accountBillNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly amountMoney?: string;

  @ApiProperty({ type: CurrencyDto })
  readonly currency: CurrencyDto;

  @ApiPropertyOptional()
  @IsOptional()
  readonly user?: UserDto;

  constructor(bill: BillEntity) {
    super(bill);
    this.amountMoney = bill.amountMoney;
    this.accountBillNumber = bill.accountBillNumber;
    this.currency = bill.currency.toDto();
    this.user = bill.user?.toDto();
  }
}
