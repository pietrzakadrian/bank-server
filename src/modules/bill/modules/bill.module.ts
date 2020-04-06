import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';

import { BillRepository } from '../repositories';
import { BillService } from '../services';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([BillRepository]),
    ],
    controllers: [],
    exports: [BillService],
    providers: [BillService],
})
export class BillModule {}
