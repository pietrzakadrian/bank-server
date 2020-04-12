import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';

import { CurrencyRepository } from '../repositories';
import { CurrencyService } from '../services';

@Module({
    imports: [
        HttpModule,
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([CurrencyRepository]),
    ],
    controllers: [],
    exports: [CurrencyService],
    providers: [CurrencyService],
})
export class CurrencyModule {}
