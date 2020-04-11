'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { UserAuthEntity } from 'modules/user/entities';

export class UserAuthDto extends AbstractDto {
    @ApiProperty()
    readonly pinCode: number;

    @ApiProperty()
    readonly lastSuccessfulLoggedDate: Date;

    @ApiProperty()
    readonly lastFailedLoggedDate: Date;

    constructor(userAuth: UserAuthEntity) {
        super(userAuth);
        this.pinCode = userAuth.pinCode;
        this.lastSuccessfulLoggedDate = userAuth.lastSuccessfulLoggedDate;
        this.lastFailedLoggedDate = userAuth.lastFailedLoggedDate;
    }
}
