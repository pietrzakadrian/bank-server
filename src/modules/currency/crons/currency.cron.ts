import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CurrencyService } from 'modules/currency/services';

@Injectable()
export class CurrencyCron {
  private readonly _logger = new Logger(CurrencyCron.name);

  constructor(private readonly _currencyService: CurrencyService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  public async setCurrencyForeignExchangeRates(): Promise<void> {
    const currencyForeignExchangeRates = await this._currencyService.getCurrencyForeignExchangeRates();
    currencyForeignExchangeRates.push({ name: 'PLN', currentExchangeRate: 1 });

    for (const { name, currentExchangeRate } of currencyForeignExchangeRates) {
      await this._currencyService.upsertCurrencyForeignExchangeRates(
        name,
        currentExchangeRate,
        currentExchangeRate === 1,
      );
    }

    this._logger.log(`Exchange rates have been updated`);
  }
}
