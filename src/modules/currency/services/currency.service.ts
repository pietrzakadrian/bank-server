import { HttpService, Injectable } from '@nestjs/common';
import { ForeignExchangeRatesNotFoundException } from 'exceptions';

import { CurrencyEntity } from '../entities';
import { CurrencyRepository } from '../repositories';

@Injectable()
export class CurrencyService {
    constructor(
        private readonly _currencyRepository: CurrencyRepository,
        private readonly _httpService: HttpService,
    ) {}

    public async findCurrency(
        uuid: string,
    ): Promise<CurrencyEntity | undefined> {
        const queryBuilder = this._currencyRepository.createQueryBuilder(
            'currency',
        );

        queryBuilder.where('currency.uuid = :uuid', { uuid });

        return queryBuilder.getOne();
    }

    public async upsertCurrencyForeignExchangeRates(
        name: string,
        currentExchangeRate, // todo: type number
        base: boolean,
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

    public async getCurrencyForeignExchangeRates(): Promise<any> {
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
