'use strict';

import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNoContentResponse,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from 'decorators';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import { UserEntity } from 'modules/user/entities';

import {
    ConfirmTransactionDto,
    CreateTransactionDto,
    TransactionsPageDto,
    TransactionsPageOptionsDto,
} from '../dto';
import { TransactionService } from '../services/transaction.service';

@Controller('Transactions')
@ApiTags('Transactions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class TransactionController {
    constructor(private readonly _transactionService: TransactionService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get transactions',
        type: TransactionsPageDto,
    })
    async getTransactions(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: TransactionsPageOptionsDto,
        @AuthUser() user: UserEntity,
    ): Promise<TransactionsPageDto | any> {
        return this._transactionService.getTransactions(user, pageOptionsDto);
    }

    @Post('create')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description: 'create transfer',
    })
    async createTransaction(
        @AuthUser() user: UserEntity,
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<void> {
        await this._transactionService.createTransaction(
            user,
            createTransactionDto,
        );
    }

    @Patch('confirm')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description: 'confirm transfer',
    })
    async confirmTransaction(
        @AuthUser() user: UserEntity,
        @Body() confirmTransactionDto: ConfirmTransactionDto,
    ): Promise<void> {
        await this._transactionService.confirmTransaction(
            user,
            confirmTransactionDto,
        );
    }
}
