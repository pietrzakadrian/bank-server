'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { UserEntity } from 'modules/user/entities';

export class UserDto extends AbstractDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiPropertyOptional()
    phone: string;

    @ApiPropertyOptional()
    avatar: string;

    constructor(user: UserEntity) {
        super(user);
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.phone = user.phone;
        this.avatar = user.avatar;
    }
}
