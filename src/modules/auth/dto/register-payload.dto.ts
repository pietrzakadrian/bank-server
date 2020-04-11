'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'modules/user/dto';

export class RegisterPayloadDto {
    @ApiProperty({ type: UserDto })
    readonly user: UserDto;

    constructor(user: UserDto) {
        this.user = user;
    }
}
