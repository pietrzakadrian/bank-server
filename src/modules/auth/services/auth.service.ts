import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    UserNotFoundException,
    UserPasswordNotValidException,
} from 'exceptions';
import { TokenPayloadDto, UserLoginDto } from 'modules/auth/dto';
import { UserEntity } from 'modules/user/entities';
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

    public async createToken(user: UserEntity): Promise<TokenPayloadDto> {
        const {
            uuid,
            userAuth: { role },
        } = user;

        return new TokenPayloadDto({
            expiresIn: this._configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this._jwtService.signAsync({ uuid, role }),
        });
    }

    public async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
        const { pinCode, password } = userLoginDto;
        let user = await this._userAuthService.findUserAuth({ pinCode });

        if (!user) {
            throw new UserNotFoundException();
        }

        const isPasswordValid = await UtilsService.validateHash(
            password,
            user.userAuth.password,
        );

        user = await this._userAuthService.updateLastLoggedDate(
            user,
            isPasswordValid,
        );

        if (!isPasswordValid) {
            throw new UserPasswordNotValidException();
        }

        return user;
    }

    public static setAuthUser(user: UserEntity) {
        ContextService.set(AuthService._authUserKey, user);
    }

    public static getAuthUser(): UserEntity {
        return ContextService.get(AuthService._authUserKey);
    }
}
