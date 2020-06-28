import { BadRequestException } from '@nestjs/common';

export class EmailAddressExistException extends BadRequestException {
  constructor(error?: string) {
    super('error.email_address_exist', error);
  }
}
