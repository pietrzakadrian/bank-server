import { BadRequestException } from '@nestjs/common';

export class ForeignExchangeRatesNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.foreign_exchange_rates_not_found', error);
  }
}
