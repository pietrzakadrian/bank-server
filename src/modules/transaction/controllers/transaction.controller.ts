'use strict';

import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
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
    ApiOkResponse,
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
    CreateTransactionPayloadDto,
    TransactionAuthorizationKeyPayloadDto,
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
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'create transfer',
        type: CreateTransactionPayloadDto,
    })
    async createTransaction(
        @AuthUser() user: UserEntity,
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<CreateTransactionPayloadDto> {
        const { uuid } = await this._transactionService.createTransaction(
            user,
            createTransactionDto,
        );

        return new CreateTransactionPayloadDto(uuid);
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

    @Get('/:uuid/authorizationKey')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'create transfer',
        type: TransactionAuthorizationKeyPayloadDto,
    })
    async getAuthorizationKey(
        @Param('uuid') uuid: string,
        @AuthUser() user: UserEntity,
    ) {
        const {
            authorizationKey,
        } = await this._transactionService.getTransaction(uuid, user);

        return new TransactionAuthorizationKeyPayloadDto(authorizationKey);
    }
}
