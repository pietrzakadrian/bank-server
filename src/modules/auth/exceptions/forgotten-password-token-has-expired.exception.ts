import { BadRequestException } from '@nestjs/common';

export class ForgottenTokenHasExpiredException extends BadRequestException {
  constructor(error?: string) {
    super('The given token has expired ', error);
  }
}
