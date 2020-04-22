import { Injectable } from '@nestjs/common';
import { CreateFailedException, CurrencyNotFoundException } from 'exceptions';
import { CurrencyService } from 'modules/currency/services';
import { UserConfigEntity } from 'modules/user/entities';
import { UserConfigRepository } from 'modules/user/repositories';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UserConfigService {
    constructor(
        private readonly _userConfigRepository: UserConfigRepository,
        private readonly _currencyService: CurrencyService,
    ) {}

    public async createUserConfig(createdUser): Promise<UserConfigEntity[]> {
        const { currency } = createdUser;
        const createdCurrency = await this._currencyService.findCurrency(
            currency,
        );

        if (!createdCurrency) {
            throw new CurrencyNotFoundException();
        }

        const config = this._userConfigRepository.create({
            ...createdUser,
            createdCurrency,
        });

        try {
            return this._userConfigRepository.save(config);
        } catch (error) {
            throw new CreateFailedException(error);
        }
    }

    public async updateLastPresentLoggedDate(
        userConfig: UserConfigEntity,
    ): Promise<UpdateResult> {
        return this._userConfigRepository.update(userConfig.id, {
            lastPresentLoggedDate: new Date(),
        });
    }
}
