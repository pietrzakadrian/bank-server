import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/modules';
import { TransactionRepository } from 'modules/transaction/repositories';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([TransactionRepository]),
    ],
    controllers: [],
    exports: [],
    providers: [],
})
export class TransactionModule {}
