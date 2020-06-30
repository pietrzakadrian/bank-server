import { NotFoundException } from '@nestjs/common';

export class LastPresentLoggedDateNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.last_present_logged_date_not_found', error);
  }
}
