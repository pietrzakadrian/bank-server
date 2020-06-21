import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'modules/user/services';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from 'utils/services';
import { UserEntity } from 'modules/user/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate({ iat, exp, uuid }): Promise<UserEntity> {
    const timeDiff = exp - iat;

    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this._userService.getUser({ uuid });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
