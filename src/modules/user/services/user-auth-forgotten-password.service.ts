import { Injectable, Logger } from '@nestjs/common';
import {
  UserAuthForgottenPasswordEntity,
  UserEntity,
} from 'modules/user/entities';
import { UserAuthForgottenPasswordRepository } from '../repositories';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { UpdateResult } from 'typeorm';
import { Order } from 'common/constants';
import { ForgottenPasswordCreateDto } from '../dtos';

@Injectable()
export class UserAuthForgottenPasswordService {
  private readonly _logger = new Logger(UserAuthForgottenPasswordService.name);

  constructor(
    private readonly _userAuthForgottenPasswordRepository: UserAuthForgottenPasswordRepository,
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService,
  ) {}

  public async createForgottenPassword(
    forgottenPasswordCreateDto: ForgottenPasswordCreateDto,
  ): Promise<UserAuthForgottenPasswordEntity> {
    const forgottenPassword = this._userAuthForgottenPasswordRepository.create(
      forgottenPasswordCreateDto,
    );
    return this._userAuthForgottenPasswordRepository.save(forgottenPassword);
  }

  public async getForgottenPassword(
    options: Partial<{ uuid: string; token: string; emailAddress: string }>,
  ): Promise<UserAuthForgottenPasswordEntity | undefined> {
    const queryBuilder = this._userAuthForgottenPasswordRepository.createQueryBuilder(
      'userAuthForgottenPassword',
    );

    queryBuilder
      .leftJoinAndSelect('userAuthForgottenPassword.user', 'user')
      .leftJoinAndSelect('user.userAuth', 'userAuth')
      .orderBy('userAuthForgottenPassword.createdAt', Order.DESC);

    if (options.token) {
      queryBuilder.orWhere('userAuthForgottenPassword.token = :token', {
        token: options.token,
      });
    }

    if (options.uuid) {
      queryBuilder.orWhere('user.uuid = :uuid', { uuid: options.uuid });
    }

    if (options.emailAddress) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.emailAddress,
      });
    }

    return queryBuilder.getOne();
  }

  public sendEmailWithToken(
    user: UserEntity,
    url: string,
    locale: string,
  ): void {
    this._mailerService
      .sendMail({
        to: user.email,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: this._getSubjectEmail(locale),
        template:
          __dirname + `/../templates/reset-password.template.${locale}.hbs`,
        context: { url },
      })
      .then(() =>
        this._logger.log(`The email with token has been sent to ${user.email}`),
      )
      .catch((error: any) =>
        this._logger.error(
          `The email with token has not been sent to ${user.email}. Reason: ${error}`,
        ),
      );
  }

  public async changeTokenActiveStatus(
    userAuthForgottenPasswordEntity: UserAuthForgottenPasswordEntity,
    status: boolean,
  ): Promise<UpdateResult> {
    /**
     * password is automatically encrypted by beforeUpdate subscriber
     * reference: UserAuthSubscriber
     */
    return this._userAuthForgottenPasswordRepository.update(
      userAuthForgottenPasswordEntity.id,
      { used: status },
    );
  }

  private _getSubjectEmail(locale: string): string {
    switch (locale) {
      case 'pl': {
        return 'Przypomnij hasło';
      }
      case 'en': {
        return 'Remind password';
      }
      case 'de': {
        return 'Passwort erinnern';
      }
    }
  }
}
