import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CurrencyService } from '../services';

@Injectable()
export class CurrencyCron {
    constructor(private readonly _currencyService: CurrencyService) {}

    @Cron(CronExpression.EVERY_12_HOURS)
    public async setCurrencyForeignExchangeRates(): Promise<void> {
        const currencyForeignExchangeRates = await this._currencyService.getCurrencyForeignExchangeRates();
        Object.assign(currencyForeignExchangeRates, { PLN: 1 });

        for await (const [name, currentExchangeRate] of Object.entries(
            currencyForeignExchangeRates,
        )) {
            this._currencyService.upsertCurrencyForeignExchangeRates(
                name,
                currentExchangeRate,
                currentExchangeRate === 1,
            );
        }
    }
}
