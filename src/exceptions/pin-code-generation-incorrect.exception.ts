'use strict';

import { BadRequestException } from '@nestjs/common';

export class PinCodeGenerationIncorrect extends BadRequestException {
    constructor(error?: string) {
        super('error.pin.code.generation.incorrect', error);
    }
}
