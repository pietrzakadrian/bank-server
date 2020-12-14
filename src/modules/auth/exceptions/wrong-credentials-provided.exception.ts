import { BadRequestException } from '@nestjs/common';

export class WrongCredentialsProvidedException extends BadRequestException {
  constructor(error?: string) {
    super('Wrong credentials provided', error);
  }
}
