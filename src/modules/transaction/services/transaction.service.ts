import { Injectable } from '@nestjs/common';
import { Order } from 'common/constants';
import {
    AmountMoneyNotEnoughException,
    AttemptMakeTransferToMyselfException,
    BillNotFoundException,
    CreateFailedException,
    TransactionNotFoundException,
} from 'exceptions';
import { BillRepository } from 'modules/bill/repositories';
import { BillService } from 'modules/bill/services';
import { UserEntity } from 'modules/user/entities';
import { UtilsService } from 'providers';
import { UpdateResult } from 'typeorm';

import { ConfirmTransactionDto, CreateTransactionDto } from '../dto';
import { TransactionEntity } from '../entities';
import { TransactionRepository } from '../repositories';

@Injectable()
export class TransactionService {
    constructor(
        private readonly _transactionRepository: TransactionRepository,
        private readonly _billRepository: BillRepository,
        private readonly _billService: BillService,
    ) {}

    public async createTransaction(
        user: UserEntity,
        createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionEntity> {
        const [recipientAccountBill, senderAccountBill] = await Promise.all([
            this._billService.findBillByUuidOrAccountBillNumber({
                uuid: createTransactionDto.recipientAccountBill,
            }),
            this._billService.findBillByUuidOrAccountBillNumber(
                { uuid: createTransactionDto.senderAccountBill },
                user,
            ),
        ]);

        if (!recipientAccountBill || !senderAccountBill) {
            throw new BillNotFoundException();
        }

        if (recipientAccountBill === senderAccountBill) {
            throw new AttemptMakeTransferToMyselfException();
        }

        if (senderAccountBill.amountMoney < createTransactionDto.amountMoney) {
            throw new AmountMoneyNotEnoughException();
        }

        const authorizationKey = this._generateAuthrorizationKey();

        const transaction = this._transactionRepository.create({
            recipientAccountBill,
            senderAccountBill,
            authorizationKey,
            amountMoney: createTransactionDto.amountMoney,
            transferTitle: createTransactionDto.transferTitle,
        });

        try {
            return this._transactionRepository.save(transaction);
        } catch (error) {
            throw new CreateFailedException(error);
        }
    }

    public async confirmTransaction(
        user: UserEntity,
        confirmTransactionDto: ConfirmTransactionDto,
    ): Promise<UpdateResult> {
        const createdTransaction = await this._findTransactionByAuthorizationKey(
            confirmTransactionDto.authorizationKey,
            user,
        );

        if (!createdTransaction) {
            throw new TransactionNotFoundException();
        }

        if (
            createdTransaction.senderAccountBill[0].amountMoney <
            createdTransaction.amountMoney
        ) {
            throw new AmountMoneyNotEnoughException();
        }

        return this._updateTransactionAuthorizationStatus(
            createdTransaction.senderAccountBill[0],
        );
    }

    private async _updateTransactionAuthorizationStatus(
        transaction: TransactionEntity,
    ): Promise<UpdateResult> {
        return this._transactionRepository.update(transaction.id, {
            authorizationStatus: true,
        });
    }

    private _generateAuthrorizationKey() {
        return UtilsService.generateRandomString(5);
    }

    private async _findTransactionByAuthorizationKey(
        authorizationKey: string,
        user: UserEntity,
    ): Promise<any | undefined> {
        const queryBuilder = this._billRepository.createQueryBuilder('bill');

        queryBuilder
            .addSelect(
                (subQuery) =>
                    subQuery
                        .select(
                            `COALESCE(
                                TRUNC(
                                    SUM(
                                        CASE WHEN "transactions"."recipient_account_bill_id" = "bill"."id" 
                                        THEN 1 / 
                                            CASE WHEN "senderAccountBillCurrency"."id" = "recipientAccountBillCurrency"."id" 
                                            THEN 1 
                                            ELSE 
                                                CASE WHEN "recipientAccountBillCurrency"."base" 
                                                THEN "senderAccountBillCurrency"."current_exchange_rate" :: decimal 
                                                ELSE "senderAccountBillCurrency"."current_exchange_rate" :: decimal * "recipientAccountBillCurrency"."current_exchange_rate" :: decimal 
                                                END
                                            END
                                        ELSE -1 
                                    END * "transactions"."amount_money"), 2), '0.00') :: numeric`,
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
                            `"bill"."id" IN ("transactions"."sender_account_bill_id", "transactions"."recipient_account_bill_id")`,
                        )
                        .andWhere('transactions.authorization_status = true'),
                'bill_amount_money',
            )
            .leftJoinAndSelect('bill.senderAccountBill', 'transaction')
            .leftJoinAndSelect('bill.currency', 'currency')
            .where('transaction.authorizationKey = :authorizationKey', {
                authorizationKey,
            })
            .andWhere('bill.user = :user', {
                user: user.id,
            })
            .andWhere('transaction.authorizationStatus = false')
            .orderBy('transaction.id', Order.DESC);

        return queryBuilder.getOne();
    }
}
