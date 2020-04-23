'use strict';

import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';

import { TransactionService } from '../services/transaction.service';

@Controller('transactions')
@ApiTags('transactions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class TransactionController {
    constructor(private readonly _transactionService: TransactionService) {}

    // @Post('create')
    // @HttpCode(HttpStatus.OK)
    // async createTransaction(
    //     @AuthUser() user: UserEntity,
    //     @Body() createTransactionDto: CreateTransactionDto,
    // ): Promise<CreateTransactionPayloadDto | any> {}

    // @Post('confirm')
    // @HttpCode(HttpStatus.OK)
    // async confirmTransaction(
    //     @AuthUser() user: UserEntity,
    //     @Body() confirmTransactionDto: ConfirmTransactionDto,
    // ): Promise<ConfirmTransactionPayloadDto | any> {}
}
