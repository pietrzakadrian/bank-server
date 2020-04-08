'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { UserAuthDto, UserConfigDto, UserDto } from 'modules/user/dto';

import { TokenPayloadDto } from './token-payload.dto';

export class LoginPayloadDto {
    @ApiProperty({ type: UserDto })
    readonly user: UserDto;

    @ApiProperty({ type: UserAuthDto })
    readonly userAuth: UserAuthDto;

    @ApiProperty({ type: UserConfigDto })
    readonly userConfig: UserConfigDto;

    @ApiProperty({ type: TokenPayloadDto })
    readonly token: TokenPayloadDto;

    constructor(
        user: UserDto,
        userAuth: UserAuthDto,
        userConfig: UserConfigDto,
        token: TokenPayloadDto,
    ) {
        this.user = user;
        this.userAuth = userAuth;
        this.userConfig = userConfig;
        this.token = token;
    }
}
