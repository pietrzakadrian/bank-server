import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { IApplicationConfig, IAwsConfig } from 'interfaces';
import { SnakeNamingStrategy } from 'utils/strategies';

export class ConfigService {
  constructor() {
    dotenv.config({ path: '.env' });

    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + 'modules/entities/*.entity{.ts,.js}'];
    let migrations = [__dirname + 'migrations/*{.ts,.js}'];

    if ((<any>module).hot) {
      const entityContext = (<any>require).context(
        './../../modules',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });
      const migrationContext = (<any>require).context(
        'migrations',
        false,
        /\.ts$/,
      );
      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext(id);
        const [migration] = Object.values(migrationModule);
        return migration;
      });
    }
    return {
      entities,
      migrations,
      keepConnectionAlive: true,
      type: 'postgres',
      host: this.get('POSTGRES_HOST'),
      port: this.getNumber('POSTGRES_PORT'),
      username: this.get('POSTGRES_USERNAME'),
      password: this.get('POSTGRES_PASSWORD'),
      database: this.get('POSTGRES_DATABASE'),
      migrationsRun: true,
      synchronize: false,
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get awsS3Config(): IAwsConfig {
    return {
      accessKeyId: this.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.get('AWS_S3_SECRET_ACCESS_KEY'),
      bucketName: this.get('S3_BUCKET_NAME'),
    };
  }

  get applicationConfig(): IApplicationConfig {
    return {
      rootEmail: this.get('BANK_ROOT_EMAIL'),
      rootPassword: this.get('BANK_ROOT_PASSWORD'),
      authorEmail: this.get('BANK_AUTHOR_EMAIL'),
      authorPassword: this.get('BANK_AUTHOR_PASSWORD'),
      authorFirstName: this.get('BANK_AUTHOR_FIRSTNAME'),
      authorLastName: this.get('BANK_AUTHOR_LASTNAME'),
    };
  }
}
