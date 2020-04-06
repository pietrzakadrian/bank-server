'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { BillEntity } from 'modules/bill/entities';

export class BillDto extends AbstractDto {
    @ApiProperty()
    accountBillNumber: string;

    constructor(bill: BillEntity) {
        super(bill);
        this.accountBillNumber = bill.accountBillNumber;
    }
}
