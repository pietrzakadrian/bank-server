import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CurrencyService } from 'modules/currency/services';

type CurrencyForeignExchangeRatesType = {
    currentExchangeRate: number;
};

@Injectable()
export class CurrencyCron {
    private readonly _logger = new Logger(CurrencyCron.name);

    constructor(private readonly _currencyService: CurrencyService) {}

    @Cron(CronExpression.EVERY_12_HOURS)
    public async setCurrencyForeignExchangeRates(): Promise<void> {
        const currencyForeignExchangeRates: CurrencyForeignExchangeRatesType = await this._currencyService.getCurrencyForeignExchangeRates();
        Object.assign(currencyForeignExchangeRates, { PLN: 1 });

        for (const [name, currentExchangeRate] of Object.entries(
            currencyForeignExchangeRates,
        )) {
            await this._currencyService.upsertCurrencyForeignExchangeRates(
                name,
                currentExchangeRate,
                currentExchangeRate === 1,
            );
        }

        this._logger.log(`Exchange rates have been updated`);
    }
}
