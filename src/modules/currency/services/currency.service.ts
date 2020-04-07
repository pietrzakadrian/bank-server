import { Injectable } from '@nestjs/common';

import { CurrencyEntity } from '../entities';
import { CurrencyRepository } from '../repositories';

@Injectable()
export class CurrencyService {
    constructor(private readonly _currencyRepository: CurrencyRepository) {}

    public async findCurrencyByName(
        options: Partial<{ name: string }>,
    ): Promise<CurrencyEntity | undefined> {
        const queryBuilder = this._currencyRepository.createQueryBuilder(
            'currency',
        );

        queryBuilder.where('currency.name = :name', {
            name: options.name,
        });

        return queryBuilder.getOne();
    }
}
