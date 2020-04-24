'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AbstractDto } from 'common/dto';
import { UserEntity } from 'modules/user/entities';

import { UserAuthDto } from './user-auth.dto';
import { UserConfigDto } from './user-config.dto';

export class UserDto extends AbstractDto {
    @ApiProperty()
    readonly firstName: string;

    @ApiProperty()
    readonly lastName: string;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly avatar: string;

    @ApiPropertyOptional({ type: UserAuthDto })
    @IsOptional()
    readonly userAuth?: UserAuthDto;

    @ApiPropertyOptional({ type: UserConfigDto })
    @IsOptional()
    readonly userConfig?: UserConfigDto;

    constructor(user: UserEntity) {
        super(user);
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.avatar = user.avatar;
        this.userAuth = user.userAuth?.toDto();
        this.userConfig = user.userConfig?.toDto();
    }
}
