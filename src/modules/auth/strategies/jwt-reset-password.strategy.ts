import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'modules/auth/services';
import { UserAuthForgottenPasswordEntity } from 'modules/user/entities';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserAuthForgottenPasswordService } from 'modules/user/services';
import { UserNotFoundException } from 'modules/user/exceptions';
import { Request } from 'express';
import { UtilsService } from 'utils/services';

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt-reset-password',
) {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _authenticationService: AuthService,
    private readonly _userAuthForgottenPasswordService: UserAuthForgottenPasswordService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get('JWT_FORGOTTEN_PASSWORD_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    { uuid },
  ): Promise<UserAuthForgottenPasswordEntity> {
    const userForgottenPassword = await this._userAuthForgottenPasswordService.getForgottenPassword(
      { uuid },
    );

    if (!userForgottenPassword) {
      throw new UserNotFoundException();
    }

    const token = request.headers.authorization.split('Bearer ')[1];
    const encodedToken = UtilsService.encodeString(token);

    await this._authenticationService.validateForgottenPasswordToken(
      userForgottenPassword,
      encodedToken,
    );

    return userForgottenPassword;
  }
}
