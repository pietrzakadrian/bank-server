import { Injectable } from '@nestjs/common';
import { RoleType } from 'common/constants';
import { CurrencyService } from 'modules/currency/services';
import { UserAuthService, UserService } from 'modules/user/services';

import { ConfigService } from './config.service';

@Injectable()
export class SettingsService {
    constructor(
        private readonly _configService: ConfigService,
        // @Inject(forwardRef(() => LanguageService))
        // private readonly _languageService: LanguageService,
        // @Inject(forwardRef(() => UserService))
        private readonly _userService: UserService,
        // @Inject(forwardRef(() => UserAuthService))
        private readonly _userAuthService: UserAuthService,
        // @Inject(forwardRef(() => CurrencyService))
        private readonly _currencyService: CurrencyService, // @Inject(forwardRef(() => CurrencyCron)) // private readonly _currencyCron: CurrencyCron,
    ) {}

    public async createAccount() {
        // await this._currencyCron.setCurrencyForeignExchangeRates();
        // await this._languageService.setLanguages();

        await this._createRootUser();
        await this._createAuthorUser();
    }

    private async _createRootUser() {
        const {
            rootEmail,
            rootPassword,
        } = this._configService.applicationConfig;

        const isRootUserExist = await this._userService.getUser({
            email: rootEmail,
        });

        if (isRootUserExist) {
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
    }

    private async _createAuthorUser() {
        const {
            authorEmail,
            authorPassword,
            authorFirstName,
            authorLastName,
        } = this._configService.applicationConfig;

        const isAuthorExist = await this._userService.getUser({
            email: authorEmail,
        });

        if (isAuthorExist) {
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
    }
}
