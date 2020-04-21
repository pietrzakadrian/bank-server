import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dto';
import { CreateFailedException, CurrencyNotFoundException } from 'exceptions';
import { AccountBillNumberGenerationIncorrect } from 'exceptions/account-bill-number-generation-incorrect.exception';
import { BillRepository } from 'modules/bill/repositories';
import { CurrencyService } from 'modules/currency/services';
import { TransactionEntity } from 'modules/transaction/entities';
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
        pageOptionsDto: BillsPageOptionsDto,
    ): Promise<BillsPageDto | undefined> {
        const queryBuilder = this._billRepository.createQueryBuilder('bills');

        const [bills, billsCount] = await queryBuilder
            .leftJoinAndSelect('bills.currency', 'currency')
            .where('bills.user = :user', { user: user.id })
            .addSelect(
                (subQuery) =>
                    subQuery
                        .select(
                            `COALESCE(
                                TRUNC(
                                    SUM(
                                        CASE WHEN "transactions"."recipient_account_bill_id" = "bills"."id"
                                            THEN 1 / CASE WHEN "senderAccountBillCurrency"."id" = "recipientAccountBillCurrency"."id"
                                                    THEN 1
                                                    ELSE CASE WHEN "recipientAccountBillCurrency"."base"
                                                            THEN "senderAccountBillCurrency"."current_exchange_rate"::decimal
                                                            ELSE "senderAccountBillCurrency"."current_exchange_rate"::decimal
                                                                * "recipientAccountBillCurrency"."current_exchange_rate"::decimal
                                                            END
                                                        END
                                            ELSE -1
                                        END * "transactions"."amount_money"
                                ), 2), 0)::float`,
                        )
                        .from(TransactionEntity, 'transactions')
                        .leftJoin(
                            'transactions.recipientAccountBill',
                            'recipientAccountBill',
                        )
                        .leftJoin(
                            'transactions.senderAccountBill',
                            'senderAccountBill',
                        )
                        .leftJoin(
                            'recipientAccountBill.currency',
                            'recipientAccountBillCurrency',
                        )
                        .leftJoin(
                            'senderAccountBill.currency',
                            'senderAccountBillCurrency',
                        )
                        .where(
                            `"bills"."id" IN ("transactions"."sender_account_bill_id", "transactions"."recipient_account_bill_id")`,
                        )
                        .andWhere('transactions.authorization_status = true'),
                'bills_amount_money',
            )

            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount: billsCount,
        });

        return new BillsPageDto(bills.toDtos(), pageMetaDto);
    }

    public async createAccountBill(createdUser): Promise<BillEntity> {
        const { currencyName } = createdUser;
        const [accountBillNumber, currency] = await Promise.all([
            this._createAccountBillNumber(),
            this._currencyService.findCurrencyByName(currencyName),
        ]);

        if (!currency) {
            throw new CurrencyNotFoundException();
        }

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

    public async getOutgoingFundsSum(user: UserEntity) {
        const queryBuilder = this._transactionRepository.createQueryBuilder(
            'transactions',
        );

        queryBuilder
            .leftJoinAndSelect(
                'transactions.senderAccountBill',
                'senderAccountBill',
            )
            .leftJoinAndSelect('senderAccountBill.user', 'user')
            .leftJoinAndSelect('user.currency', 'currency')
            .where('user = :user', { user: user.id });

        return queryBuilder.execute();
    }

    // public async getIncomingFundsSum(user: UserEntity) {
    //     const queryBuilder = this._transactionRepository.createQueryBuilder(
    //         'transactions',
    //     );

    //     return queryBuilder.execute();
    // }

    // public async getAccountBalanceHistory(user: UserEntity) {}
}
