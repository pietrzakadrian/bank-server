'use strict';

import { ApiProperty } from '@nestjs/swagger';

export class AccountBalanceDto {
    @ApiProperty()
    readonly revenues: string;

    @ApiProperty()
    readonly expenses: string;

    constructor(data: { revenues: string; expenses: string }) {
        this.revenues = data.revenues;
        this.expenses = data.expenses;
    }
}
