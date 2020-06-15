import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RoleType } from 'common/constants';
import { CurrencyCron } from 'modules/currency/crons';
import { CurrencyService } from 'modules/currency/services';
import { LanguageService } from 'modules/language/services';
import { UserAuthService, UserService } from 'modules/user/services';

import { ConfigService } from './config.service';

@Injectable()
export class AppService implements OnModuleInit {
    private readonly _logger = new Logger(AppService.name);

    private _currencyCron: CurrencyCron;
    private _currencyService: CurrencyService;
    private _languageService: LanguageService;
    private _configService: ConfigService;
    private _userService: UserService;
    private _userAuthService: UserAuthService;

    constructor(private _moduleRef: ModuleRef) {}

    async onModuleInit() {
        this._currencyCron = this._moduleRef.get(CurrencyCron, {
            strict: false,
        });
        this._languageService = this._moduleRef.get(LanguageService, {
            strict: false,
        });
        this._configService = this._moduleRef.get(ConfigService, {
            strict: false,
        });
        this._userService = this._moduleRef.get(UserService, { strict: false });
        this._userAuthService = this._moduleRef.get(UserAuthService, {
            strict: false,
        });
        this._currencyService = this._moduleRef.get(CurrencyService, {
            strict: false,
        });

        await this.initLanguage();
        await this.initExchangeRates();
        await this.initRootUser();
        await this.initAuthorUser();
    }

    async initExchangeRates() {
        await this._currencyCron.setCurrencyForeignExchangeRates();
        this._logger.log(`Exchange rates have been initiated`);
    }

    async initLanguage() {
        await this._languageService.setLanguages();
        this._logger.log(`Languages have been initiated`);
    }

    async initRootUser() {
        const {
            rootEmail,
            rootPassword,
        } = this._configService.applicationConfig;

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

        await this._userAuthService.updateRole(userAuth, RoleType.ADMIN);

        this._logger.log(`Root user have been initiated`);
    }

    async initAuthorUser() {
        const {
            authorEmail,
            authorPassword,
            authorFirstName,
            authorLastName,
        } = this._configService.applicationConfig;

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
