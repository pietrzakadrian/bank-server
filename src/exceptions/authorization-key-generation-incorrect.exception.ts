import { BadRequestException } from '@nestjs/common';

export class AuthorizationKeyGenerationIncorrect extends BadRequestException {
  constructor(error?: string) {
    super('error.authorization_key_generation_incorrect', error);
  }
}
