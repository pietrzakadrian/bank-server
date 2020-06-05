'use strict';

import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
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
    BillDto,
    BillsPageDto,
    BillsPageOptionsDto,
    CreateBillDto,
    SearchBillsPayloadDto,
    TotalAccountBalanceHistoryPayloadDto,
    TotalAccountBalancePayloadDto,
    TotalAmountMoneyPayloadDto,
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
        description: "Get User's bills list",
        type: BillsPageDto,
    })
    async userBills(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: BillsPageOptionsDto,
        @AuthUser() user: UserEntity,
    ): Promise<BillsPageDto> {
        return this._billService.getBills(user, pageOptionsDto);
    }

    @Post('/')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get User's bills list",
        type: BillDto,
    })
    async createBill(
        @AuthUser() user: UserEntity,
        @Body() createBillDto: CreateBillDto,
    ): Promise<BillDto> {
        const bill = await this._billService.createAccountBill({
            user,
            currency: createBillDto.currency,
        });
        return bill.toDto();
    }

    @Get('/amountMoney')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get User's amount money",
        type: TotalAmountMoneyPayloadDto,
    })
    async userAmountMoney(
        @AuthUser() user: UserEntity,
    ): Promise<TotalAmountMoneyPayloadDto> {
        return this._billService.getTotalAmountMoney(user);
    }

    @Get('/accountBalance')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get User's account balance history",
        type: TotalAccountBalancePayloadDto,
    })
    async userAccountBalance(
        @AuthUser() user: UserEntity,
    ): Promise<TotalAccountBalancePayloadDto> {
        return this._billService.getTotalAccountBalance(user);
    }

    @Get('/accountBalanceHistory')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get User's account balance history",
        type: TotalAccountBalanceHistoryPayloadDto,
    })
    async userAccountBalanceHistory(
        @AuthUser() user: UserEntity,
    ): Promise<TotalAccountBalanceHistoryPayloadDto> {
        return this._billService.getTotalAccountBalanceHistory(user);
    }

    @Get('/:accountBillNumber/search')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get bills',
        type: BillsPageDto,
    })
    async searchBills(
        @Param('accountBillNumber') accountBillNumber: string,
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: BillsPageOptionsDto,
        @AuthUser() user: UserEntity,
    ): Promise<SearchBillsPayloadDto> {
        return this._billService.searchBill(
            accountBillNumber,
            pageOptionsDto,
            user,
        );
    }
}
