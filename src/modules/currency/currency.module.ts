import { HttpModule, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from 'modules/currency/controllers';
import { CurrencyCron } from 'modules/currency/crons';
import { CurrencyRepository } from 'modules/currency/repositories';
import { CurrencyService } from 'modules/currency/services';
import { UserModule } from 'modules/user/user.module';
import { BillModule } from 'modules/bill/bill.module';
import { TransactionModule } from 'modules/transaction/transaction.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => UserModule),
    forwardRef(() => TransactionModule),
    forwardRef(() => BillModule),
    TypeOrmModule.forFeature([CurrencyRepository]),
  ],
  controllers: [CurrencyController],
  exports: [CurrencyService, CurrencyCron],
  providers: [CurrencyService, CurrencyCron],
})
export class CurrencyModule {}
