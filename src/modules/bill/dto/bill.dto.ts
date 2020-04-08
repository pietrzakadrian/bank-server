'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { BillEntity } from 'modules/bill/entities';
import { CurrencyDto } from 'modules/currency/dto';

export class BillDto extends AbstractDto {
    @ApiProperty()
    readonly accountBillNumber: string;

    @ApiProperty({ type: CurrencyDto })
    readonly currency: CurrencyDto;

    constructor(bill: BillEntity) {
        super(bill);
        this.accountBillNumber = bill.accountBillNumber;
        this.currency = bill.currency.toDto();
    }
}
