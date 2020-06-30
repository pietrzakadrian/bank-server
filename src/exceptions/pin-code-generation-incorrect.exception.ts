import { BadRequestException } from '@nestjs/common';

export class PinCodeGenerationIncorrectException extends BadRequestException {
  constructor(error?: string) {
    super('error.pin_code_generation_incorrect', error);
  }
}
