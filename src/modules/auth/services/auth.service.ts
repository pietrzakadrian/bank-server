import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    UserNotFoundException,
    UserPasswordNotValidException,
} from 'exceptions';
import { TokenPayloadDto, UserLoginDto } from 'modules/auth/dto';
import { UserAuthEntity, UserEntity } from 'modules/user/entities';
import { UserAuthService, UserService } from 'modules/user/services';
import { ContextService, UtilsService } from 'providers';
import { ConfigService } from 'shared/services';

@Injectable()
export class AuthService {
    private static _authUserKey = 'user_key';

    constructor(
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
        private readonly _userService: UserService,
        private readonly _userAuthService: UserAuthService,
    ) {}

    async createToken(userAuth: UserAuthEntity): Promise<TokenPayloadDto> {
        const {
            user: { uuid },
            role,
        } = userAuth;

        return new TokenPayloadDto({
            expiresIn: this._configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this._jwtService.signAsync({ uuid, role }),
        });
    }

    async validateUser(userLoginDto: UserLoginDto): Promise<any> {
        const { pinCode, password } = userLoginDto;

        const userAuth = await this._userAuthService.findUserAuthByPinCode(
            pinCode,
        );

        const isPasswordValid = await UtilsService.validateHash(
            password,
            userAuth && userAuth.password,
        );

        if (!userAuth) {
            throw new UserNotFoundException();
        }

        if (!isPasswordValid) {
            throw new UserPasswordNotValidException();
        }

        const {
            user,
            user: { userConfig },
        } = userAuth;
        return [user, userAuth, userConfig];
    }

    static setAuthUser(userAuth: UserAuthEntity) {
        ContextService.set(AuthService._authUserKey, userAuth);
    }

    static getAuthUser(): UserEntity {
        return ContextService.get(AuthService._authUserKey);
    }
}
