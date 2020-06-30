import { NotFoundException } from '@nestjs/common';

export class BillNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.bill_not_found', error);
  }
}
