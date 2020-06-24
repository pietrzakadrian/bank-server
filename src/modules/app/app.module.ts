import 'providers/polyfill.provider';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'utils/strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from 'modules/shared/shared.module';
import { CurrencyModule } from 'modules/currency/currency.module';
import { LanguageModule } from 'modules/language/language.module';
import { UserModule } from 'modules/user/user.module';
import { AuthModule } from 'modules/auth/auth.module';
import { BillModule } from 'modules/bill/bill.module';
import { TransactionModule } from 'modules/transaction/transaction.module';
import { AppService } from 'modules/app/services';
import { contextMiddleware, RegisterPromotionMiddleware } from 'middlewares';
import { UserAuthSubscriber } from 'modules/user/subscribers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    CurrencyModule,
    BillModule,
    TransactionModule,
    LanguageModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        subscribers: [UserAuthSubscriber],
        migrationsRun: true,
        logger: 'file',
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
    consumer.apply(RegisterPromotionMiddleware).forRoutes('/Auth/login');
  }
}
