import { Injectable } from '@nestjs/common';
import { CreateFailedException, PinCodeGenerationIncorrect } from 'exceptions';
import { UserAuthEntity } from 'modules/user/entities';
import { UserAuthRepository } from 'modules/user/repositories';
import { UtilsService } from 'providers';
import { FindConditions } from 'typeorm';

@Injectable()
export class UserAuthService {
    constructor(private readonly _userAuthRepository: UserAuthRepository) {}

    public async getUserAuth(
        findData: FindConditions<UserAuthEntity>,
    ): Promise<UserAuthEntity> {
        return this._userAuthRepository.findOne(findData);
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
        const authEntity = await this._findUserAuthByPinCode({ pinCode });

        try {
            return authEntity ? await this._createPinCode() : pinCode;
        } catch (error) {
            throw new PinCodeGenerationIncorrect(error);
        }
    }

    private _generatePinCode(): number {
        return UtilsService.generateRandomInteger(1, 9e4);
    }

    private async _findUserAuthByPinCode(
        options: Partial<{ pinCode: number }>,
    ): Promise<UserAuthEntity | undefined> {
        const queryBuilder = this._userAuthRepository.createQueryBuilder(
            'auth',
        );

        queryBuilder.where('auth.pinCode = :pinCode', {
            pinCode: options.pinCode,
        });

        return queryBuilder.getOne();
    }
}
