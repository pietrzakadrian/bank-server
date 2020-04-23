'use strict';

import { ApiProperty } from '@nestjs/swagger';

export class AccountBalanceHistoryPayloadDto {
    @ApiProperty()
    readonly accountBalanceHistory: number[];

    constructor(accountBalanceHistory: number[]) {
        this.accountBalanceHistory = accountBalanceHistory;
    }
}
