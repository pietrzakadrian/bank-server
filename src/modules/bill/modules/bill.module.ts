import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';

import { BillRepository } from '../repositories';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([BillRepository]),
    ],
    controllers: [],
    exports: [],
    providers: [],
})
export class BillModule {}
