import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';
import { UserController } from 'modules/user/controllers';
import { UserAuthRepository, UserRepository } from 'modules/user/repositories';
import { UserAuthService, UserService } from 'modules/user/services';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([UserRepository, UserAuthRepository]),
    ],
    controllers: [UserController],
    exports: [UserService, UserAuthService],
    providers: [UserService, UserAuthService],
})
export class UserModule {}
