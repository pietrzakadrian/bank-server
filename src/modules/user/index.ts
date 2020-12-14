import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth';
import { BillRepository } from 'modules/bill/repositories';
import { CurrencyRepository } from 'modules/currency/repositories';
import { TransactionRepository } from 'modules/transaction/repositories';
import { UserController } from 'modules/user/controllers';
import {
  UserAuthForgottenPasswordRepository,
  UserAuthRepository,
  UserConfigRepository,
  UserRepository,
} from 'modules/user/repositories';
import {
  UserAuthForgottenPasswordService,
  UserAuthService,
  UserConfigService,
  UserService,
} from 'modules/user/services';
import { BillModule } from 'modules/bill';
import { CurrencyModule } from 'modules/currency';
import { MessageModule } from 'modules/message';
import { TransactionModule } from 'modules/transaction';
import { UserAuthForgottenPasswordEntity } from './entities';

@Module({
  imports: [
    forwardRef(() => MessageModule),
    forwardRef(() => CurrencyModule),
    forwardRef(() => BillModule),
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionModule),
    TypeOrmModule.forFeature([
      UserRepository,
      UserAuthRepository,
      UserConfigRepository,
      UserAuthForgottenPasswordRepository,
      BillRepository,
      CurrencyRepository,
      TransactionRepository,
    ]),
  ],
  controllers: [UserController],
  exports: [
    UserAuthService,
    UserConfigService,
    UserService,
    UserAuthForgottenPasswordService,
  ],
  providers: [
    UserAuthService,
    UserConfigService,
    UserService,
    UserAuthForgottenPasswordService,
  ],
})
export class UserModule {}
