'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { BillDto } from 'modules/bill/dto';
import { TransactionEntity } from 'modules/transaction/entities';

export class TransactionDto extends AbstractDto {
    @ApiProperty()
    readonly amountMoney: number;

    @ApiProperty()
    readonly transferTitle: string;

    @ApiProperty()
    readonly authorizationKey: string;

    @ApiProperty()
    readonly authorizationStatus: boolean;

    @ApiProperty()
    readonly updatedAt: Date;

    @ApiProperty({ type: BillDto })
    readonly recipientAccountBill: BillDto;

    @ApiProperty({ type: BillDto })
    readonly senderAccountBill: BillDto;

    constructor(transaction: TransactionEntity) {
        super(transaction);
        this.amountMoney = transaction.amountMoney;
        this.transferTitle = transaction.transferTitle;
        this.authorizationKey = transaction.authorizationKey;
        this.authorizationStatus = transaction.authorizationStatus;
        this.updatedAt = transaction.updatedAt;
        this.recipientAccountBill = transaction.recipientAccountBill.toDto();
        this.senderAccountBill = transaction.senderAccountBill.toDto();
    }
}
