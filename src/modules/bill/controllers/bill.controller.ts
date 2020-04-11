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
export class BillController {
    constructor(private _billService: BillService) {}

    @Get('/bills')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @Roles(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `Get User's bills list`,
        type: BillsPageDto,
    })
    getUsers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: BillsPageOptionsDto,
        @AuthUser() user: UserEntity,
    ): Promise<BillsPageDto> {
        return this._billService.getBills(user, pageOptionsDto);
    }
}
