import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserNotFoundException } from 'exceptions';
import { TokenPayloadDto, UserLoginDto } from 'modules/auth/dto';
import { UserAuthEntity, UserEntity } from 'modules/user/entities';
import { UserAuthService, UserService } from 'modules/user/services';
import { ContextService, UtilsService } from 'providers';
import { ConfigService } from 'shared/services';

@Injectable()
export class AuthService {
    private static _authUserKey = 'user_key';

    constructor(
        public readonly jwtService: JwtService,
        public readonly configService: ConfigService,
        public readonly userService: UserService,
        public readonly userAuthService: UserAuthService,
    ) {}

    async createToken(userAuth: UserAuthEntity): Promise<TokenPayloadDto> {
        const {
            user: { uuid },
            role,
        } = userAuth;

        return new TokenPayloadDto({
            expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this.jwtService.signAsync({ uuid, role }),
        });
    }

    async validateUser(userLoginDto: UserLoginDto): Promise<UserAuthEntity> {
        const { pinCode, password } = userLoginDto;

        const userAuth = await this.userAuthService.getUserAuth({ pinCode });

        const isPasswordValid = await UtilsService.validateHash(
            password,
            userAuth && userAuth.password,
        );

        if (!userAuth || !isPasswordValid) {
            throw new UserNotFoundException();
        }

        return userAuth;
    }

    static setAuthUser(userAuth: UserAuthEntity) {
        ContextService.set(AuthService._authUserKey, userAuth);
    }

    static getAuthUser(): UserEntity {
        return ContextService.get(AuthService._authUserKey);
    }
}
