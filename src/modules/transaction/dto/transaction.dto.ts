'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { BillDto } from 'modules/bill/dto';
import { TransactionEntity } from 'modules/transaction/entities';

export class TransactionDto extends AbstractDto {
    @ApiProperty()
    amountMoney: number;

    @ApiProperty()
    transferTitle: string;

    @ApiProperty()
    authorizationKey: string;

    @ApiProperty()
    authorizationStatus: boolean;

    @ApiProperty()
    recipientAccountBill: BillDto;

    @ApiProperty()
    senderAccountBill: BillDto;

    constructor(transaction: TransactionEntity) {
        super(transaction);
        this.amountMoney = transaction.amountMoney;
        this.transferTitle = transaction.transferTitle;
        this.authorizationKey = transaction.authorizationKey;
        this.authorizationStatus = transaction.authorizationStatus;
        this.recipientAccountBill = transaction.recipientAccountBill;
        this.senderAccountBill = transaction.senderAccountBill;
    }
}
