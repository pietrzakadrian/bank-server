import { SnakeNamingStrategy } from 'utils/strategies';
import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';
import { UserAuthSubscriber } from 'modules/user/subscribers';

const configService = new ConfigService();

// Replace \\n with \n to support multiline strings in AWS
// for (const envName of Object.keys(process.env)) {
//   process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
// }

const config: ConnectionOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: +configService.get<number>('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USERNAME'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DATABASE'),
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/**/*{.entity,.index}{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsRun: true,
  subscribers: [UserAuthSubscriber],
  synchronize: false,
  logging: true,
  logger: 'file',
};

export = config;
