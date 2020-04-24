import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';
import { BillRepository } from 'modules/bill/repositories';
import { BillService } from 'modules/bill/services';
import { CurrencyRepository } from 'modules/currency/repositories';
import { CurrencyService } from 'modules/currency/services';
import { TransactionRepository } from 'modules/transaction/repositories';

import { TransactionController } from '../controllers';
import { TransactionService } from '../services/transaction.service';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([
            TransactionRepository,
            BillRepository,
            CurrencyRepository,
        ]),
    ],
    controllers: [TransactionController],
    exports: [TransactionService, BillService, CurrencyService],
    providers: [TransactionService, BillService, CurrencyService],
})
export class TransactionModule {}
