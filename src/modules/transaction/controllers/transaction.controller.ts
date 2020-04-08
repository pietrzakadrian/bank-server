// 'use strict';

// import {
//     Body,
//     Controller,
//     HttpCode,
//     HttpStatus,
//     Post,
//     UseGuards,
//     UseInterceptors,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { RoleType } from 'common/constants';
// import { AuthUser, Roles } from 'decorators';
// import { AuthGuard, RolesGuard } from 'guards';
// import { AuthUserInterceptor } from 'interceptors';
// import { UsersPageDto, UsersPageOptionsDto } from 'modules/user/dto';
// import { UserEntity } from 'modules/user/entities';
// import { UserService } from 'modules/user/services';

// import { ConfirmTransactionDto, CreateTransactionDto } from '../dto';
// import { ConfirmTransactionPayloadDto } from '../dto/confirm-transaction-payload.dto';
// import { CreateTransactionPayloadDto } from '../dto/create-transaction-payload.dto';
// import { TransactionService } from '../services/transaction.service';

// @Controller('transactions')
// @ApiTags('transactions')
// @UseGuards(AuthGuard, RolesGuard)
// @UseInterceptors(AuthUserInterceptor)
// @ApiBearerAuth()
// export class TransactionController {
//     constructor(private readonly _transactionService: TransactionService) {}

//     @Post('create')
//     @HttpCode(HttpStatus.OK)
//     async createTransaction(
//         @Body() createTransactionDto: CreateTransactionDto,
//     ): Promise<CreateTransactionPayloadDto | void> {}

//     @Post('confirm')
//     @HttpCode(HttpStatus.OK)
//     async confirmTransaction(
//         @Body() confirmTransactionDto: ConfirmTransactionDto,
//     ): Promise<ConfirmTransactionPayloadDto | void> {}
// }
