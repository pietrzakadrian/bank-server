import { forwardRef, Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/auth.module';
import { BillRepository } from 'modules/bill/repositories';
import { CurrencyRepository } from 'modules/currency/repositories';
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
import { BillModule } from 'modules/bill/bill.module';
import { CurrencyModule } from 'modules/currency/currency.module';
import { MessageModule } from 'modules/message/message.module';
import { LanguageModule } from 'modules/language/language.module';

@Module({
  imports: [
    BillModule,
    LanguageModule,
    forwardRef(() => MessageModule),
    forwardRef(() => CurrencyModule),
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
  exports: [UserAuthService, UserConfigService, UserService],
  providers: [UserAuthService, UserConfigService, UserService],
})
export class UserModule {}
