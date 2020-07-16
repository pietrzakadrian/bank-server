import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { RoleType } from 'common/constants';
import {
  AmountMoneyNotEnoughException,
  AttemptMakeTransferToMyselfException,
  BillNotFoundException,
} from 'exceptions';

@Injectable()
export class ValidatorService {
  public isImage(mimeType: string): boolean {
    const imageMimeTypes = ['image/jpeg', 'image/png'];

    return _.includes(imageMimeTypes, mimeType);
  }

  public isCorrectAmountMoney(
    role: RoleType,
    senderAmountMoney: string | number,
    transactionAmountMoney: string | number,
  ): boolean {
    if (transactionAmountMoney <= 0) {
      throw new AmountMoneyNotEnoughException();
    }

    if (this.isHigherRole(role)) {
      return true;
    }

    if (Number(senderAmountMoney) < Number(transactionAmountMoney)) {
      throw new AmountMoneyNotEnoughException();
    }

    return true;
  }

  public isCorrectRecipient(
    senderBillId: number,
    recipientBillId: number,
  ): boolean {
    if (!senderBillId || !recipientBillId) {
      throw new BillNotFoundException();
    }

    if (senderBillId === recipientBillId) {
      throw new AttemptMakeTransferToMyselfException();
    }

    return true;
  }

  public isHigherRole(role: RoleType): boolean {
    if (
      Object.values(RoleType)
        .filter((item) => item !== RoleType.USER)
        .includes(role)
    ) {
      return true;
    }

    return false;
  }
}
