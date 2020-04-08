'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { BillDto } from 'modules/bill/dto';
import { UserAuthDto, UserDto } from 'modules/user/dto';

export class RegisterPayloadDto {
    @ApiProperty({ type: UserDto })
    readonly user: UserDto;

    @ApiProperty({ type: UserAuthDto })
    readonly userAuth: UserAuthDto;

    @ApiProperty({ type: BillDto })
    readonly bill: BillDto;

    constructor(user: UserDto, userAuth: UserAuthDto, bill: BillDto) {
        this.user = user;
        this.userAuth = userAuth;
        this.bill = bill;
    }
}
