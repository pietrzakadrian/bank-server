import { BadRequestException } from '@nestjs/common';

export class ForgottenTokenHasUsedException extends BadRequestException {
  constructor(error?: string) {
    super('The given token has used ', error);
  }
}
