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
import { BillsPageDto, BillsPageOptionsDto } from 'modules/bill/dto';
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
    })
    async userAmountMoney(@AuthUser() user: UserEntity): Promise<any> {
        return this._billService.getAmountMoney(user);
    }

    @Get('/accountBalanceHistory')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's account balance history`,
    })
    async userAccountBalanceHistory(
        @AuthUser() user: UserEntity,
    ): Promise<any> {
        return this._billService.getAccountBalanceHistory(user);
    }

    @Get('/savings')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's account balance history`,
    })
    async userSavings(@AuthUser() user: UserEntity): Promise<any> {
        return this._billService.getSavings(user);
    }
}
