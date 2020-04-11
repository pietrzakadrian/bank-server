'use strict';

import { ApiProperty } from '@nestjs/swagger';

import { TokenPayloadDto } from './token-payload.dto';

export class LoginPayloadDto {
    @ApiProperty({ type: TokenPayloadDto })
    readonly token: TokenPayloadDto;

    constructor(token: TokenPayloadDto) {
        this.token = token;
    }
}
