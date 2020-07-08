import { Injectable } from '@nestjs/common';
import { CreateFailedException, CurrencyNotFoundException } from 'exceptions';
import { CurrencyService } from 'modules/currency/services';
import { UserConfigEntity } from 'modules/user/entities';
import { UserConfigRepository } from 'modules/user/repositories';
import { UpdateResult } from 'typeorm';
import { CurrencyEntity } from 'modules/currency/entities';

@Injectable()
export class UserConfigService {
  constructor(
    private readonly _userConfigRepository: UserConfigRepository,
    private readonly _currencyService: CurrencyService,
  ) {}

  public async createUserConfig(createdUser): Promise<UserConfigEntity> {
    const currency = await this._currencyService.findCurrency({
      uuid: createdUser.currency,
    });

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
    const queryBuilder = this._userConfigRepository.createQueryBuilder(
      'userConfig',
    );

    return queryBuilder
      .update()
      .set({ lastPresentLoggedDate: new Date() })
      .where('id = :id', { id: userConfig.id })
      .execute();
  }

  public async updateMainCurrency(
    userConfig: UserConfigEntity,
    currency: CurrencyEntity,
  ): Promise<UpdateResult> {
    const queryBuilder = this._userConfigRepository.createQueryBuilder(
      'userConfig',
    );

    return queryBuilder
      .update()
      .set({ currency })
      .where('id = :id', { id: userConfig.id })
      .execute();
  }

  public async setNotification(
    userConfig: UserConfigEntity,
    reset = false,
  ): Promise<UpdateResult> {
    const queryBuilder = this._userConfigRepository.createQueryBuilder(
      'userConfig',
    );

    return queryBuilder
      .update()
      .set({
        notificationCount: () => (reset ? '0' : 'notification_count + 1'),
      })
      .where('id = :id', { id: userConfig.id })
      .execute();
  }
}
