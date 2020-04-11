import { Injectable } from '@nestjs/common';
import { CreateFailedException } from 'exceptions';
import { UserConfigEntity } from 'modules/user/entities';
import { UserConfigRepository } from 'modules/user/repositories';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UserConfigService {
    constructor(private readonly _userConfigRepository: UserConfigRepository) {}

    public async createUserConfig(createdUser): Promise<UserConfigEntity[]> {
        const config = this._userConfigRepository.create(createdUser);

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
