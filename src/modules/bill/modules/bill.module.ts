import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';
import { CurrencyRepository } from 'modules/currency/repositories';
import { CurrencyService } from 'modules/currency/services';

import { BillRepository } from '../repositories';
import { BillService } from '../services';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([BillRepository, CurrencyRepository]),
    ],
    controllers: [],
    exports: [BillService],
    providers: [BillService, CurrencyService],
})
export class BillModule {}
