'use strict';

import { ApiProperty } from '@nestjs/swagger';

export class AccountBalanceHistoryDto {
    @ApiProperty()
    readonly accountBalanceHistory: number[];

    constructor(accountBalanceHistory: number[]) {
        this.accountBalanceHistory = accountBalanceHistory;
    }
}
