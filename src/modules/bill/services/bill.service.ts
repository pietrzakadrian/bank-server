import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dto';
import { CreateFailedException } from 'exceptions';
import { AccountBillNumberGenerationIncorrect } from 'exceptions/account-bill-number-generation-incorrect.exception';
import { BillRepository } from 'modules/bill/repositories';
import { CurrencyService } from 'modules/currency/services';
import { UserEntity } from 'modules/user/entities';
import { UtilsService } from 'providers';

import { BillsPageDto, BillsPageOptionsDto } from '../dto';
import { BillEntity } from '../entities';

@Injectable()
export class BillService {
    constructor(
        private readonly _billRepository: BillRepository,
        private readonly _currencyService: CurrencyService,
    ) {}

    public async getBills(
        user: UserEntity,
        pageOptionsDto?: BillsPageOptionsDto,
    ): Promise<BillsPageDto | undefined> {
        const queryBuilder = this._billRepository.createQueryBuilder('bills');

        const [bills, billsCount] = await queryBuilder
            .leftJoinAndSelect('bills.currency', 'currency')
            .where('bills.user = :user', { user: user.id })
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount: billsCount,
        });

        return new BillsPageDto(bills.toDtos(), pageMetaDto);
    }

    public async createAccountBill(createdUser): Promise<BillEntity[] | any> {
        const { currencyName } = createdUser;
        const [accountBillNumber, currency] = await Promise.all([
            this._createAccountBillNumber(),
            this._currencyService.findCurrencyByName(currencyName),
        ]);

        const createdBill: BillEntity = {
            ...createdUser,
            accountBillNumber,
            currency,
        };
        const bill = this._billRepository.create(createdBill);

        try {
            return this._billRepository.save(bill);
        } catch (error) {
            throw new CreateFailedException(error);
        }
    }

    private async _createAccountBillNumber(): Promise<string> {
        const accountBillNumber = this._generateAccountBillNumber();
        const billEntity = await this._findBillByAccountBillNumber(
            accountBillNumber,
        );

        try {
            return billEntity
                ? await this._createAccountBillNumber()
                : accountBillNumber;
        } catch (error) {
            throw new AccountBillNumberGenerationIncorrect(error);
        }
    }

    private _generateAccountBillNumber(): string {
        const checksum = UtilsService.generateRandomInteger(10, 99); // CC
        const bankOrganizationalUnitNumber = 28229297; // AAAA AAAA
        const customerAccountNumber = UtilsService.generateRandomInteger(
            1e15,
            9e15,
        ); // BBBB BBBB BBBB BBBB

        return `${checksum}${bankOrganizationalUnitNumber}${customerAccountNumber}`;
    }

    private async _findBillByAccountBillNumber(
        accountBillNumber: string,
    ): Promise<BillEntity | undefined> {
        const queryBuilder = this._billRepository.createQueryBuilder('bill');

        queryBuilder.where('bill.accountBillNumber = :accountBillNumber', {
            accountBillNumber,
        });

        return queryBuilder.getOne();
    }

    public async getAmountMoney(user: UserEntity): Promise<BillEntity[] | any> {
        const queryBuilder = this._billRepository.createQueryBuilder('bills');

        queryBuilder

            .leftJoin('bills.recipientAccountBill', 'recipientAccountBill')
            .leftJoin('bills.senderAccountBill', 'senderAccountBill')
            .leftJoin('bills.currency', 'currency')
            .select(
                `SUM(CASE
                    WHEN "recipientAccountBill"."recipient_account_bill_id" = bills.id
                    THEN 1 ELSE -1 END * "recipientAccountBill"."amount_money") as TOTAL`,
            )
            .where('bills.user = :user', { user: user.id })
            .andWhere(
                `bills.id IN ("senderAccountBill"."sender_account_bill_id",
                "recipientAccountBill"."recipient_account_bill_id")`,
            );

        return queryBuilder.execute();

        // select sum(case when transactions.recipient_account_bill_id = 2 then 1 else -1 end * amount_money)
        // from transactions as transactions
        // where 2 in (transactions.sender_account_bill_id, transactions.recipient_account_bill_id)

        // return bills.toDtos();
    }
}
