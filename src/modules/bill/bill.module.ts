import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from 'modules/bill/controllers';
import { BillRepository } from 'modules/bill/repositories';
import { BillService } from 'modules/bill/services';
import { CurrencyRepository } from 'modules/currency/repositories';
import { TransactionRepository } from 'modules/transaction/repositories';
import { CurrencyModule } from 'modules/currency/currency.module';
import { BillSubscriber } from './subscribers';
import { MessageModule } from 'modules/message/message.module';
import { UserModule } from 'modules/user/user.module';
import { LanguageModule } from 'modules/language/language.module';
import { TransactionModule } from 'modules/transaction/transaction.module';

@Module({
  imports: [
    MessageModule,
    LanguageModule,
    forwardRef(() => TransactionModule),
    forwardRef(() => UserModule),
    forwardRef(() => CurrencyModule),
    TypeOrmModule.forFeature([
      BillRepository,
      CurrencyRepository,
      TransactionRepository,
    ]),
  ],
  controllers: [BillController],
  exports: [BillService],
  providers: [BillService, BillSubscriber],
})
export class BillModule {}
