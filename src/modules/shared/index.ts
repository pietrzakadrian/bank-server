import { Global, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GeneratorService, ValidatorService } from 'utils/services';
import { ConfigService } from '@nestjs/config';

const providers = [ValidatorService, GeneratorService];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get('JWT_SECRET_KEY'),
        // signOptions: {
        //   expiresIn: configService.get<number>('JWT_EXPIRATION_TIME'),
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}
