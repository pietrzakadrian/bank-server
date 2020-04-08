'use strict';

import { ApiProperty } from '@nestjs/swagger';

import { TransactionDto } from './transaction.dto';

export class CreateTransactionPayloadDto {
    @ApiProperty({ type: TransactionDto })
    transaction: TransactionDto;

    constructor(transaction: TransactionDto) {
        this.transaction = transaction;
    }
}
