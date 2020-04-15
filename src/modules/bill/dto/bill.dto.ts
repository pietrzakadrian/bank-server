'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { BillEntity } from 'modules/bill/entities';
import { CurrencyDto } from 'modules/currency/dto';

export class BillDto extends AbstractDto {
    @ApiProperty()
    readonly accountBillNumber: string;

    @ApiProperty()
    readonly amountNumber: number;

    @ApiProperty({ type: CurrencyDto })
    readonly currency: CurrencyDto;

    constructor(bill: BillEntity) {
        super(bill);
        this.amountNumber = bill.amountMoney;
        this.accountBillNumber = bill.accountBillNumber;
        this.currency = bill.currency.toDto();
    }
}
