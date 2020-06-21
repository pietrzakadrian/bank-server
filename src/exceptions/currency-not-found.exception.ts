'use strict';

import { NotFoundException } from '@nestjs/common';

export class CurrencyNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super('error.currency_not_found', error);
    }
}
