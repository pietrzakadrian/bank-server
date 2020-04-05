import './boilerplate.polyfill';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { contextMiddleware } from 'middlewares';
import { AuthModule } from 'modules/auth/modules';
import { BillModule } from 'modules/bill/modules';
import { CurrencyModule } from 'modules/currency/modules';
import { MathModule } from 'modules/math/math.module';
import { TransactionModule } from 'modules/transaction/modules';
import { UserModule } from 'modules/user/modules';
import { SharedModule } from 'shared/modules';
import { ConfigService } from 'shared/services';

@Module({
    imports: [
        AuthModule,
        UserModule,
        MathModule,
        CurrencyModule,
        BillModule,
        TransactionModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
