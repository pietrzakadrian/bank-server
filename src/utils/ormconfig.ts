import 'providers/polyfill.provider';

import { SnakeNamingStrategy } from 'utils/strategies';
import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';
import {
  UserAuthForgottenPasswordSubscriber,
  UserAuthSubscriber,
  UserSubscriber,
} from 'modules/user/subscribers';

const configService = new ConfigService();

const config: ConnectionOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/**/*{.entity,.index}{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsRun: true,
  subscribers: [
    UserSubscriber,
    UserAuthSubscriber,
    UserAuthForgottenPasswordSubscriber,
  ],
  synchronize: false,
  logging: true,
};

export = config;
