import { Injectable } from '@nestjs/common';
import { UserConfigEntity } from 'modules/user/entities';
import { UserConfigRepository } from 'modules/user/repositories';

@Injectable()
export class UserConfigService {
    constructor(private readonly _userConfigRepository: UserConfigRepository) {}

    public async createUserConfig(createdUser): Promise<UserConfigEntity[]> {
        const config = this._userConfigRepository.create(createdUser);

        return this._userConfigRepository.save(config);
    }
}
