'use strict';

import { BadRequestException } from '@nestjs/common';

export class CreateNewBillFailedException extends BadRequestException {
    constructor(error?: string) {
        super('error.create_new_bill_failed', error);
    }
}
