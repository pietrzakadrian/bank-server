import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';
import { CurrencyController } from 'modules/currency/controllers';
import { CurrencyCron } from 'modules/currency/crons';
import { CurrencyRepository } from 'modules/currency/repositories';
import { CurrencyService } from 'modules/currency/services';

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
