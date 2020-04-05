import { Injectable } from '@nestjs/common';
import { UserAuthEntity } from 'modules/user/entities';
import { UserAuthRepository } from 'modules/user/repositories';
import { FindConditions } from 'typeorm';

@Injectable()
export class UserAuthService {
    constructor(public readonly userAuthRepository: UserAuthRepository) {}

    /**
     * Find single userAuth
     */
    findOne(findData: FindConditions<UserAuthEntity>): Promise<UserAuthEntity> {
        return this.userAuthRepository.findOne(findData);
    }
}
