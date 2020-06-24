import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillController } from 'modules/bill/controllers';
import { BillRepository } from 'modules/bill/repositories';
import { BillService } from 'modules/bill/services';
import { CurrencyRepository } from 'modules/currency/repositories';
import { TransactionRepository } from 'modules/transaction/repositories';
import { CurrencyModule } from 'modules/currency/currency.module';

@Module({
  imports: [
    forwardRef(() => CurrencyModule),
    TypeOrmModule.forFeature([
      BillRepository,
      CurrencyRepository,
      TransactionRepository,
    ]),
  ],
  controllers: [BillController],
  exports: [BillService],
  providers: [BillService],
})
export class BillModule {}
