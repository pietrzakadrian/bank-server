'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    readonly amountMoney: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly transferTitle: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly senderAccountBill: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly recipientAccountBill: string;
}
