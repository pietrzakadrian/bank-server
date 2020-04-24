import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';

import { CurrencyController } from '../controllers';
import { CurrencyCron } from '../crons';
import { CurrencyRepository } from '../repositories';
import { CurrencyService } from '../services';

@Module({
    imports: [
        HttpModule,
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([CurrencyRepository]),
    ],
    controllers: [CurrencyController],
    exports: [CurrencyService],
    providers: [CurrencyService, CurrencyCron],
})
export class CurrencyModule {}
