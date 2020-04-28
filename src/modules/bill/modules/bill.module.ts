import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';
import { BillController } from 'modules/bill/controllers';
import { BillRepository } from 'modules/bill/repositories';
import { BillService } from 'modules/bill/services';
import { CurrencyRepository } from 'modules/currency/repositories';
import { CurrencyService } from 'modules/currency/services';
import { TransactionRepository } from 'modules/transaction/repositories';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([
            BillRepository,
            CurrencyRepository,
            TransactionRepository,
        ]),
    ],
    controllers: [BillController],
    exports: [BillService],
    providers: [BillService, CurrencyService],
})
export class BillModule {}
