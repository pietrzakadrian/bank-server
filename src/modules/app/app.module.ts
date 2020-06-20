import 'providers/polyfill.provider';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'modules/app/controllers';
import { AppService } from 'modules/app/services';
import { SnakeNamingStrategy } from 'utils/strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '51.38.132.176',
      port: 5432,
      username: 'admin_banknew22',
      password: 'admin_banknew22',
      database: 'admin_banknew22',
      autoLoadEntities: true,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
      keepConnectionAlive: true,
      migrationsRun: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
