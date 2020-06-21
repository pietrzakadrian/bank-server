'use strict';

import { ApiProperty } from '@nestjs/swagger';

export class TotalAccountBalancePayloadDto {
    @ApiProperty()
    readonly revenues: string;

    @ApiProperty()
    readonly expenses: string;

    @ApiProperty()
    readonly currencyName: string;

    constructor(data: {
        revenues: string;
        expenses: string;
        currencyName: string;
    }) {
        this.revenues = data.revenues;
        this.expenses = data.expenses;
        this.currencyName = data.currencyName;
    }
}
