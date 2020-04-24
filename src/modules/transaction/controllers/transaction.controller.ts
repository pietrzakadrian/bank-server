'use strict';

import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'decorators';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import { UserEntity } from 'modules/user/entities';

import { ConfirmTransactionDto, CreateTransactionDto } from '../dto';
import { ConfirmTransactionPayloadDto } from '../dto/confirm-transaction-payload.dto';
import { CreateTransactionPayloadDto } from '../dto/create-transaction-payload.dto';
import { TransactionService } from '../services/transaction.service';

@Controller('Transaction')
@ApiTags('Transaction')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class TransactionController {
    constructor(private readonly _transactionService: TransactionService) {}

    @Post('create')
    @HttpCode(HttpStatus.OK)
    async createTransaction(
        @AuthUser() user: UserEntity,
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<CreateTransactionPayloadDto | any> {
        const transaction = await this._transactionService.createTransaction(
            user,
            createTransactionDto,
        );

        return transaction.toDto();
    }

    @Patch('confirm')
    @HttpCode(HttpStatus.OK)
    async confirmTransaction(
        @AuthUser() user: UserEntity,
        @Body() confirmTransactionDto: ConfirmTransactionDto,
    ): Promise<ConfirmTransactionPayloadDto | any> {
        return this._transactionService.confirmTransaction(
            user,
            confirmTransactionDto,
        );
    }
}
