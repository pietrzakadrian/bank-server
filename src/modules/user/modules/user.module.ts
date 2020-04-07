import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';
import { BillRepository } from 'modules/bill/repositories';
import { BillService } from 'modules/bill/services';
import { CurrencyRepository } from 'modules/currency/repositories';
import { CurrencyService } from 'modules/currency/services';
import { UserController } from 'modules/user/controllers';
import {
    UserAuthRepository,
    UserConfigRepository,
    UserRepository,
} from 'modules/user/repositories';
import { UserAuthService, UserService } from 'modules/user/services';

import { UserConfigService } from '../services/user-config.service';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([
            UserRepository,
            UserAuthRepository,
            UserConfigRepository,
            BillRepository,
            CurrencyRepository,
        ]),
    ],
    controllers: [UserController],
    exports: [UserService, UserAuthService, UserConfigService],
    providers: [
        UserService,
        UserAuthService,
        UserConfigService,
        BillService,
        CurrencyService,
    ],
})
export class UserModule {}
