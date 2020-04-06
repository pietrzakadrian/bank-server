import { Injectable } from '@nestjs/common';
import { AccountBillNumberGenerationIncorrect } from 'exceptions/account-bill-number-generation-incorrect.exception';
import { BillRepository } from 'modules/bill/repositories';
import { UserEntity } from 'modules/user/entities';

import { BillEntity } from '../entities';

@Injectable()
export class BillService {
    constructor(public readonly billRepository: BillRepository) {}

    async createAccountBill(user: UserEntity): Promise<BillEntity> {
        const accountBillNumber = await this.createAccountBillNumber();
        const createdBill = { ...user, accountBillNumber };
        const bill = this.billRepository.create(createdBill);

        return this.billRepository.save(bill);
    }

    async createAccountBillNumber(): Promise<string> {
        const accountBillNumber = this.generateAccountBillNumber();
        const billEntity = await this.findAccountBillByAccountBillNumber({
            accountBillNumber,
        });

        try {
            return billEntity
                ? await this.createAccountBillNumber()
                : accountBillNumber;
        } catch (error) {
            throw new AccountBillNumberGenerationIncorrect(error);
        }
    }

    generateAccountBillNumber(): string {
        const checkSum = Math.floor(Math.random() * 1e2); // CC
        const bankOrganizationalUnitNumber = 28229297; // AAAA AAAA
        const customerAccountNumber = Math.floor(Math.random() * 1e16); // BBBB BBBB BBBB BBBB

        return `${checkSum}${bankOrganizationalUnitNumber}${customerAccountNumber}`;
    }

    async findAccountBillByAccountBillNumber(
        options: Partial<{ accountBillNumber: string }>,
    ): Promise<BillEntity | undefined> {
        const queryBuilder = this.billRepository.createQueryBuilder('bill');

        queryBuilder.where('bill.accountBillNumber = :accountBillNumber', {
            accountBillNumber: options.accountBillNumber,
        });

        return queryBuilder.getOne();
    }
}
