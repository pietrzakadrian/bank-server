import { HttpService, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ForeignExchangeRatesNotFoundException } from 'exceptions';

import { CurrencyEntity } from '../entities';
import { CurrencyRepository } from '../repositories';

@Injectable()
export class CurrencyService {
    constructor(
        private readonly _currencyRepository: CurrencyRepository,
        private readonly _httpService: HttpService,
    ) {}

    public async findCurrencyByName(
        name: string,
    ): Promise<CurrencyEntity | undefined> {
        const queryBuilder = this._currencyRepository.createQueryBuilder(
            'currency',
        );

        queryBuilder.where('currency.name = :name', { name });

        return queryBuilder.getOne();
    }

    @Cron('1 * * * * *')
    public async getget() {
        const currencyForeignExchangeRates = await this._getCurrencyForeignExchangeRates();
        Object.assign(currencyForeignExchangeRates, { PLN: 1 });

        for await (const [name, currentExchangeRate] of Object.entries(
            currencyForeignExchangeRates,
        )) {
            this._updateCurrencyForeignExchangeRates(
                name,
                currentExchangeRate,
                name === 'PLN',
            );
        }
    }

    private async _updateCurrencyForeignExchangeRates(
        name,
        currentExchangeRate,
        base,
    ): Promise<void> {
        const queryBuilder = this._currencyRepository.createQueryBuilder(
            'currency',
        );

        await queryBuilder
            .insert()
            .values({ name, currentExchangeRate, base })
            .onConflict(
                `("name") DO UPDATE
                SET current_exchange_rate = :currentExchangeRate`,
            )
            .setParameter('currentExchangeRate', currentExchangeRate)
            .execute();
    }

    private async _getCurrencyForeignExchangeRates(): Promise<any> {
        const endpoint = `https://api.exchangeratesapi.io/latest?base=PLN&symbols=USD,EUR`;

        return this._httpService
            .get(endpoint)
            .toPromise()
            .then((response) => response.data.rates)
            .catch((error) => {
                throw new ForeignExchangeRatesNotFoundException(error);
            });
    }
}
