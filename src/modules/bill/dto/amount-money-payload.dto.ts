'use strict';

import { ApiProperty } from '@nestjs/swagger';

export class AmountMoneyPayloadDto {
    @ApiProperty()
    readonly amountMoney: string;

    @ApiProperty()
    readonly currencyName: string;

    constructor(data: { amountMoney: string; currencyName: string }) {
        this.amountMoney = data.amountMoney;
        this.currencyName = data.currencyName;
    }
}
