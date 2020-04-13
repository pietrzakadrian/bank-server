import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dto';
import { CreateFailedException } from 'exceptions';
import { AccountBillNumberGenerationIncorrect } from 'exceptions/account-bill-number-generation-incorrect.exception';
import { BillRepository } from 'modules/bill/repositories';
import { CurrencyService } from 'modules/currency/services';
import { TransactionRepository } from 'modules/transaction/repositories';
import { UserEntity } from 'modules/user/entities';
import { UtilsService } from 'providers';

import { BillsPageDto, BillsPageOptionsDto } from '../dto';
import { BillEntity } from '../entities';

@Injectable()
export class BillService {
    constructor(
        private readonly _billRepository: BillRepository,
        private readonly _transactionRepository: TransactionRepository,
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

    public async getAmountMoney(bill: BillEntity): Promise<any> {
        const queryBuilder = this._transactionRepository.createQueryBuilder(
            'transactions',
        );

        queryBuilder
            .select(
                `ROUND(SUM(
                    CASE
                        WHEN "transactions"."recipient_account_bill_id" = "recipientAccountBill"."id" AND "recipientAccountBill"."user_id" = :userId
                        THEN 1
                        ELSE -1
                    END * "transactions"."amount_money" *
                    CASE
                        WHEN "senderAccountBillCurrency"."id" = "recipientAccountBillCurrency"."id"
                        THEN 1
                        ELSE
                            CASE
                                WHEN "recipientAccountBillCurrency"."base"
                                THEN 1 / "senderAccountBillCurrency"."current_exchange_rate"
                                ELSE "senderAccountBillCurrency"."current_exchange_rate"
                            END 
                    END
                )::numeric, 2)::float8 AS total`,
            )
            .leftJoin(
                'transactions.recipientAccountBill',
                'recipientAccountBill',
            )
            .leftJoin('transactions.senderAccountBill', 'senderAccountBill')
            .leftJoin(
                'recipientAccountBill.currency',
                'recipientAccountBillCurrency',
            )
            .leftJoin('senderAccountBill.currency', 'senderAccountBillCurrency')
            .where(
                `:billId IN ("transactions"."sender_account_bill_id", "transactions"."recipient_account_bill_id")`,
            )
            .setParameter('userId', bill.user.id)
            .setParameter('billId', bill.id);

        return queryBuilder.execute();
    }
}
