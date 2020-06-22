import 'providers/polyfill.provider';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'modules/app/services';
import { SnakeNamingStrategy } from 'utils/strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from 'modules/shared/shared.module';
import { CurrencyModule } from 'modules/currency/currency.module';
import { LanguageModule } from 'modules/language/language.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CurrencyModule,
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
        migrationsRun: true,
        logger: 'file',
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
