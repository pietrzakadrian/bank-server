import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';
import { BillRepository } from 'modules/bill/repositories';
import { BillService } from 'modules/bill/services';
import { CurrencyRepository } from 'modules/currency/repositories';
import { CurrencyService } from 'modules/currency/services';
import { TransactionRepository } from 'modules/transaction/repositories';
import { UserController } from 'modules/user/controllers';
import {
    UserAuthRepository,
    UserConfigRepository,
    UserRepository,
} from 'modules/user/repositories';
import {
    UserAuthService,
    UserConfigService,
    UserService,
} from 'modules/user/services';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([
            UserRepository,
            UserAuthRepository,
            UserConfigRepository,
            BillRepository,
            CurrencyRepository,
            TransactionRepository,
        ]),
    ],
    controllers: [UserController],
    exports: [UserService, UserAuthService, UserConfigService, BillService],
    providers: [
        UserService,
        UserAuthService,
        UserConfigService,
        BillService,
        CurrencyService,
    ],
})
export class UserModule {}
