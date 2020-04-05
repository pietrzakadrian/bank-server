'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { UserAuthEntity } from 'modules/user/entities';

export class UserAuthDto extends AbstractDto {
    @ApiProperty()
    pinCode: number;

    @ApiProperty()
    password: string;

    constructor(userAuth: UserAuthEntity) {
        super(userAuth);
        this.pinCode = userAuth.pinCode;
        this.password = userAuth.password;
    }
}
