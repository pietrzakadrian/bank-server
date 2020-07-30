import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillRepository } from 'modules/bill/repositories';
import { CurrencyRepository } from 'modules/currency/repositories';
import { TransactionController } from 'modules/transaction/controllers';
import { TransactionRepository } from 'modules/transaction/repositories';
import { TransactionService } from 'modules/transaction/services';
import { CurrencyModule } from 'modules/currency';
import { BillModule } from 'modules/bill';
import { UserModule } from 'modules/user';
import { LanguageModule } from 'modules/language';

@Module({
  imports: [
    LanguageModule,
    forwardRef(() => UserModule),
    forwardRef(() => CurrencyModule),
    forwardRef(() => BillModule),
    TypeOrmModule.forFeature([
      TransactionRepository,
      BillRepository,
      CurrencyRepository,
    ]),
  ],
  controllers: [TransactionController],
  exports: [TransactionService],
  providers: [TransactionService],
})
export class TransactionModule {}
