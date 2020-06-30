import { NotFoundException } from '@nestjs/common';

export class TransactionNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.transaction_not_found', error);
  }
}
