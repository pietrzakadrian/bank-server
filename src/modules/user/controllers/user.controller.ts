'use strict';

import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNoContentResponse,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RoleType } from 'common/constants';
import { AbstractCheckDto } from 'common/dto';
import { AuthUser, Roles } from 'decorators';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import { UserEntity } from 'modules/user/entities';
import { UserConfigService, UserService } from 'modules/user/services';

import { UserDto } from '../dto';

@Controller('Users')
@ApiTags('Users')
export class UserController {
    constructor(
        private readonly _userService: UserService,
        private readonly _userConfigService: UserConfigService,
    ) {}

    @Get('/')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get user',
        type: UserDto,
    })
    async getUserData(@AuthUser() user: UserEntity): Promise<void> {
        return user.toDto();
    }

    @Get('/:email/checkEmail')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get user',
        type: AbstractCheckDto,
    })
    async checkEmail(@Param('email') email: string) {
        const userEmail = await this._userService.getUser({ email });
        return new AbstractCheckDto(userEmail);
    }

    @Patch('/notifications')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description: 'All notification unset',
    })
    async uncheckNotifications(@AuthUser() user: UserEntity): Promise<void> {
        await this._userConfigService.unsetAllNotifications(user.userConfig);
    }

    @Patch('/messages')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @Roles(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description: 'All messages unset',
    })
    async uncheckMessages(@AuthUser() user: UserEntity): Promise<void> {
        await this._userConfigService.unsetAllMessages(user.userConfig);
    }
}
