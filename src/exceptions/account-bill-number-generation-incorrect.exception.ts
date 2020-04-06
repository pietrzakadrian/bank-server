'use strict';

import { BadRequestException } from '@nestjs/common';

export class AccountBillNumberGenerationIncorrect extends BadRequestException {
    constructor(error?: string) {
        super('error.account.bill.number.generation.incorrect', error);
    }
}
