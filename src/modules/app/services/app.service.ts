import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RoleType } from 'common/constants';
import { CurrencyCron } from 'modules/currency/crons';
import { CurrencyService } from 'modules/currency/services';
import { LanguageService } from 'modules/language/services';
import { UserAuthService, UserService } from 'modules/user/services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly _logger = new Logger(AppService.name);
  private readonly _configService = new ConfigService();
  private readonly _moduleOptions = { strict: false };

  private _currencyCron: CurrencyCron;
  private _currencyService: CurrencyService;
  private _languageService: LanguageService;
  private _userService: UserService;
  private _userAuthService: UserAuthService;

  constructor(private readonly _moduleRef: ModuleRef) {}

  public async onModuleInit(): Promise<void> {
    this._currencyCron = this._moduleRef.get(CurrencyCron, this._moduleOptions);
    this._languageService = this._moduleRef.get(
      LanguageService,
      this._moduleOptions,
    );
    this._userService = this._moduleRef.get(UserService, this._moduleOptions);
    this._userAuthService = this._moduleRef.get(
      UserAuthService,
      this._moduleOptions,
    );
    this._currencyService = this._moduleRef.get(
      CurrencyService,
      this._moduleOptions,
    );

    await this._initLanguage();
    await this._initExchangeRates();
    await Promise.all([this._initRootUser(), this._initAuthorUser()]);
  }

  private async _initExchangeRates(): Promise<void> {
    await this._currencyCron.setCurrencyForeignExchangeRates();
    this._logger.log(`Exchange rates have been initiated`);
  }

  private async _initLanguage(): Promise<void> {
    await this._languageService.setLanguages();
    this._logger.log(`Languages have been initiated`);
  }

  private async _initRootUser(): Promise<void> {
    const rootEmail = this._configService.get('BANK_ROOT_EMAIL');
    const rootPassword = this._configService.get('BANK_ROOT_PASSWORD');

    const isExistRootUser = await this._userService.getUser({
      email: rootEmail,
    });

    if (isExistRootUser) {
      return;
    }

    const { uuid } = await this._currencyService.findCurrency({
      name: 'USD',
    });

    const { userAuth } = await this._userService.createUser({
      firstName: 'Bank',
      lastName: 'Application',
      email: rootEmail,
      password: rootPassword,
      currency: uuid,
    });

    await this._userAuthService.updateRole(userAuth, RoleType.ROOT);

    this._logger.log(`Root user have been initiated`);
  }

  private async _initAuthorUser(): Promise<void> {
    const authorEmail = this._configService.get('BANK_AUTHOR_EMAIL');
    const authorPassword = this._configService.get('BANK_AUTHOR_PASSWORD');
    const authorFirstName = this._configService.get('BANK_AUTHOR_FIRSTNAME');
    const authorLastName = this._configService.get('BANK_AUTHOR_LASTNAME');

    const isExistAuthorUser = await this._userService.getUser({
      email: authorEmail,
    });

    if (isExistAuthorUser) {
      return;
    }

    const { uuid } = await this._currencyService.findCurrency({
      name: 'USD',
    });

    const { userAuth } = await this._userService.createUser({
      firstName: authorFirstName,
      lastName: authorLastName,
      email: authorEmail,
      password: authorPassword,
      currency: uuid,
    });

    await this._userAuthService.updateRole(userAuth, RoleType.ADMIN);
    this._logger.log(`Author user have been initiated`);
  }
}
