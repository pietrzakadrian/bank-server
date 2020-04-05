import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';

import { CurrencyRepository } from '../repositories';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([CurrencyRepository]),
    ],
    controllers: [],
    exports: [],
    providers: [],
})
export class CurrencyModule {}
