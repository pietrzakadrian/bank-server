'use strict';

import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'common/constants';
import { AuthUser, Roles } from 'decorators';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import {
    AccountBalanceHistoryPayloadDto,
    AccountBalancePayloadDto,
    AmountMoneyPayloadDto,
    BillsPageDto,
    BillsPageOptionsDto,
} from 'modules/bill/dto';
import { BillService } from 'modules/bill/services';
import { UserEntity } from 'modules/user/entities';

@Controller('Bills')
@ApiTags('Bills')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class BillController {
    constructor(private _billService: BillService) {}

    @Get('/')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's bills list`,
        type: BillsPageDto,
    })
    async userBills(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: BillsPageOptionsDto,
        @AuthUser() user: UserEntity,
    ): Promise<BillsPageDto> {
        return this._billService.getBills(user, pageOptionsDto);
    }

    @Get('/amountMoney')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's amount money`,
        type: AmountMoneyPayloadDto,
    })
    async userAmountMoney(
        @AuthUser() user: UserEntity,
    ): Promise<AmountMoneyPayloadDto> {
        return this._billService.getAmountMoney(user);
    }

    @Get('/accountBalance')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's account balance history`,
        type: AccountBalancePayloadDto,
    })
    async userAccountBalance(
        @AuthUser() user: UserEntity,
    ): Promise<AccountBalancePayloadDto> {
        return this._billService.getAccountBalance(user);
    }

    @Get('/accountBalanceHistory')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's account balance history`,
        type: AccountBalanceHistoryPayloadDto,
    })
    async userAccountBalanceHistory(
        @AuthUser() user: UserEntity,
    ): Promise<AccountBalanceHistoryPayloadDto> {
        return this._billService.getAccountBalanceHistory(user);
    }
}
