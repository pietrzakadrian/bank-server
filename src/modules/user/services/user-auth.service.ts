import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
    CreateFailedException,
    LastPresentLoggedDateNotFoundException,
    PinCodeGenerationIncorrect,
} from 'exceptions';
import { UserAuthEntity, UserEntity } from 'modules/user/entities';
import { UserAuthRepository } from 'modules/user/repositories';
import { UserService } from 'modules/user/services';
import { UtilsService } from 'providers';
import { UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { UserConfigService } from './user-config.service';

@Injectable()
export class UserAuthService {
    constructor(
        private readonly _userAuthRepository: UserAuthRepository,
        @Inject(forwardRef(() => UserService))
        private readonly _userService: UserService,
        private readonly _userConfigService: UserConfigService,
    ) {}

    @Transactional()
    public async updateLastLoggedDate(
        user: UserEntity,
        isSuccessiveLogged: boolean,
    ): Promise<void> {
        const { userAuth, userConfig } = user;

        if (!isSuccessiveLogged) {
            await this._updateLastFailedLoggedDate(userAuth);
        } else {
            const { lastSuccessfulLoggedDate } = userAuth;
            if (!lastSuccessfulLoggedDate) {
                await this._updateLastSuccessfulLoggedDate(userAuth);
                await this._userConfigService.updateLastPresentLoggedDate(
                    userConfig,
                );
            } else {
                const { lastPresentLoggedDate } = userConfig;
                if (!lastPresentLoggedDate) {
                    throw new LastPresentLoggedDateNotFoundException();
                }

                await this._updateLastSuccessfulLoggedDate(
                    userAuth,
                    lastPresentLoggedDate,
                );
                await this._userConfigService.updateLastPresentLoggedDate(
                    userConfig,
                );
            }
        }
    }

    public async createUserAuth(createdUser): Promise<UserAuthEntity[]> {
        const pinCode = await this._createPinCode();
        const auth = this._userAuthRepository.create({
            ...createdUser,
            pinCode,
        });

        try {
            return this._userAuthRepository.save(auth);
        } catch (error) {
            throw new CreateFailedException(error);
        }
    }

    private async _createPinCode(): Promise<number> {
        const pinCode = this._generatePinCode();
        const userEntity = await this._userService.findUserByPinCode(pinCode);

        try {
            return userEntity ? await this._createPinCode() : pinCode;
        } catch (error) {
            throw new PinCodeGenerationIncorrect(error);
        }
    }

    private _generatePinCode(): number {
        return UtilsService.generateRandomInteger(1, 9e4);
    }

    private async _updateLastFailedLoggedDate(
        userAuth: UserAuthEntity,
    ): Promise<UpdateResult> {
        return this._userAuthRepository.update(userAuth.id, {
            lastFailedLoggedDate: new Date(),
        });
    }

    private async _updateLastSuccessfulLoggedDate(
        userAuth: UserAuthEntity,
        lastPresentLoggedDate?: Date,
    ): Promise<UpdateResult> {
        return this._userAuthRepository.update(userAuth.id, {
            lastSuccessfulLoggedDate: lastPresentLoggedDate ?? new Date(),
        });
    }
}
