'use strict';

import { ApiProperty } from '@nestjs/swagger';

export class TransactionAuthorizationKeyPayloadDto {
    @ApiProperty()
    readonly authorizationKey: string;

    constructor(authorizationKey: string) {
        this.authorizationKey = authorizationKey;
    }
}
