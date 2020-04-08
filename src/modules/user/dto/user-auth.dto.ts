'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from 'common/constants';
import { AbstractDto } from 'common/dto';
import { UserAuthEntity } from 'modules/user/entities';

export class UserAuthDto extends AbstractDto {
    @ApiProperty({ enum: RoleType })
    readonly role: RoleType;

    @ApiProperty()
    readonly pinCode: number;

    @ApiProperty()
    readonly password: string;

    @ApiProperty()
    readonly lastSuccessfulLoggedDate: Date;

    @ApiProperty()
    readonly lastFailedLoggedDate: Date;

    constructor(userAuth: UserAuthEntity) {
        super(userAuth);
        this.role = userAuth.role;
        this.pinCode = userAuth.pinCode;
        this.password = userAuth.password;
        this.lastSuccessfulLoggedDate = userAuth.lastSuccessfulLoggedDate;
        this.lastFailedLoggedDate = userAuth.lastFailedLoggedDate;
    }
}
