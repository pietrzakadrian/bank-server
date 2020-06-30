import { BadRequestException } from '@nestjs/common';

export class AttemptMakeTransferToMyselfException extends BadRequestException {
  constructor(error?: string) {
    super('error.attempt_make_transfer_to_myself', error);
  }
}
