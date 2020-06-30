import { BadRequestException } from '@nestjs/common';

export class AccountBillNumberGenerationIncorrect extends BadRequestException {
  constructor(error?: string) {
    super('error.account_bill_number_generation_incorrect', error);
  }
}
