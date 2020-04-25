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

    public async createUserConfig(createdUser): Promise<UserConfigEntity> {
        const currency = await this._currencyService.findCurrency(
            createdUser.currency,
        );

        if (!currency) {
            throw new CurrencyNotFoundException();
        }

        const createdCurrency: UserConfigEntity = { ...createdUser, currency };
        const config = this._userConfigRepository.create(createdCurrency);

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

    public async unsetAllNotifications(
        userConfig: UserConfigEntity,
    ): Promise<UpdateResult> {
        return this._userConfigRepository.update(userConfig.id, {
            notificationStatus: false,
            notificationCount: 0,
        });
    }

    public async unsetAllMessages(
        userConfig: UserConfigEntity,
    ): Promise<UpdateResult> {
        return this._userConfigRepository.update(userConfig.id, {
            messageStatus: false,
            messageCount: 0,
        });
    }
}
