import { BadRequestException } from '@nestjs/common';

export class AmountMoneyNotEnoughException extends BadRequestException {
  constructor(error?: string) {
    super('error.amount_money_not_enough', error);
  }
}
