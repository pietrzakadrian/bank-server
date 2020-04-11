'use strict';

import { ApiProperty } from '@nestjs/swagger';
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
    readonly phone: string;

    @ApiProperty()
    readonly avatar: string;

    @ApiProperty({ type: UserAuthDto })
    readonly userAuth: UserAuthDto;

    @ApiProperty({ type: UserConfigDto })
    readonly userConfig: UserConfigDto;

    constructor(user: UserEntity) {
        super(user);
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.phone = user.phone;
        this.avatar = user.avatar;
        this.userAuth = user.userAuth.toDto();
        this.userConfig = user.userConfig.toDto();
    }
}
