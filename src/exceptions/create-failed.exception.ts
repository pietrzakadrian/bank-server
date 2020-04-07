'use strict';

import { BadRequestException } from '@nestjs/common';

export class CreateFailedException extends BadRequestException {
    constructor(error?: string) {
        super('create.failed', error);
    }
}
