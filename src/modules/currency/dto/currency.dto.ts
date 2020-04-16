'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { CurrencyEntity } from 'modules/currency/entities';

export class CurrencyDto extends AbstractDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly currentExchangeRate: number;

    constructor(currency: CurrencyEntity) {
        super(currency);
        this.name = currency.name;
        this.currentExchangeRate = currency.currentExchangeRate;
    }
}
