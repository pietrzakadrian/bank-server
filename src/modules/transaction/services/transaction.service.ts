import { Injectable } from '@nestjs/common';
import { Order, RoleType } from 'common/constants';
import { PageMetaDto } from 'common/dto';
import {
    AmountMoneyNotEnoughException,
    AttemptMakeTransferToMyselfException,
    BillNotFoundException,
    CreateFailedException,
    TransactionNotFoundException,
} from 'exceptions';
import { BillEntity } from 'modules/bill/entities';
import { BillRepository } from 'modules/bill/repositories';
import { BillService } from 'modules/bill/services';
import {
    ConfirmTransactionDto,
    CreateTransactionDto,
    TransactionsPageDto,
    TransactionsPageOptionsDto,
} from 'modules/transaction/dto';
import { TransactionEntity } from 'modules/transaction/entities';
import { TransactionRepository } from 'modules/transaction/repositories';
import { UserEntity } from 'modules/user/entities';
import { UtilsService } from 'providers';
import { UpdateResult } from 'typeorm';

@Injectable()
export class TransactionService {
    constructor(
        private readonly _transactionRepository: TransactionRepository,
        private readonly _billRepository: BillRepository,
        private readonly _billService: BillService,
    ) {}

    public async getTransactions(
        user: UserEntity,
        pageOptionsDto: TransactionsPageOptionsDto,
    ): Promise<TransactionsPageDto | undefined> {
        const queryBuilder = this._transactionRepository.createQueryBuilder(
            'transactions',
        );

        const [transactions, transactionsCount] = await queryBuilder
            .addSelect([
                'recipientUser.firstName',
                'recipientUser.lastName',
                'recipientUser.avatar',
                'senderUser.firstName',
                'senderUser.lastName',
                'senderUser.avatar',
            ])
            .leftJoinAndSelect('transactions.senderBill', 'senderBill')
            .leftJoinAndSelect('transactions.recipientBill', 'recipientBill')
            .leftJoin('recipientBill.user', 'recipientUser')
            .leftJoinAndSelect(
                'recipientBill.currency',
                'recipientBillCurrency',
            )
            .leftJoin('senderBill.user', 'senderUser')
            .leftJoinAndSelect('senderBill.currency', 'senderBillCurrency')
            .where(':user IN ("senderUser"."id", "recipientUser"."id")')
            .andWhere('transactions.authorizationStatus = true')
            .orderBy('transactions.updatedAt', pageOptionsDto.order)
            .setParameter('user', user.id)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount: transactionsCount,
        });

        return new TransactionsPageDto(transactions.toDtos(), pageMetaDto);
    }

    public async getTransaction(
        options: Partial<{
            uuid: string;
            authorizationKey: string;
            recipientUser: UserEntity;
            senderUser: UserEntity;
        }>,
    ): Promise<TransactionEntity | undefined> {
        const queryBuilder = this._transactionRepository.createQueryBuilder(
            'transaction',
        );

        queryBuilder
            // .andWhere('transaction.authorizationStatus = false')
            .orderBy('transaction.id', Order.DESC);

        if (options.recipientUser) {
            queryBuilder
                .leftJoin('transaction.recipientBill', 'recipientBill')
                .leftJoin('recipientBill.user', 'recipientUser')
                .orWhere('recipientUser.id = :user', {
                    user: options.recipientUser.id,
                });
        }

        if (options.senderUser) {
            queryBuilder
                .leftJoin('transaction.senderBill', 'senderBill')
                .leftJoin('senderBill.user', 'senderUser')
                .orWhere('senderUser.id = :user', {
                    user: options.senderUser.id,
                });
        }

        if (options.uuid) {
            queryBuilder.orWhere('transaction.uuid = :uuid', {
                uuid: options.uuid,
            });
        }

        if (options.authorizationKey) {
            queryBuilder.andWhere(
                'transaction.authorizationKey = :authorizationKey',
                { authorizationKey: options.authorizationKey },
            );
        }

        return queryBuilder.getOne();
    }

    public async createTransaction(
        user: UserEntity,
        createTransactionDto: CreateTransactionDto,
        authorizationKey?: string,
    ): Promise<TransactionEntity> {
        const [recipientBill, senderBill] = await Promise.all([
            this._billService.findBill(createTransactionDto.recipientBill),
            this._billService.findBill(createTransactionDto.senderBill, user),
        ]);

        if (!recipientBill || !senderBill) {
            throw new BillNotFoundException();
        }

        if (recipientBill === senderBill) {
            throw new AttemptMakeTransferToMyselfException();
        }

        const largerAmountMoney = UtilsService.compareNumbers(
            senderBill.amountMoney,
            createTransactionDto.amountMoney,
        );

        if (
            user.userAuth.role !== RoleType.ADMIN &&
            (largerAmountMoney === createTransactionDto.amountMoney ||
                createTransactionDto.amountMoney <= 0)
        ) {
            throw new AmountMoneyNotEnoughException();
        }

        const createdTransaction = {
            recipientBill,
            senderBill,
            authorizationKey:
                authorizationKey ?? this._generateAuthrorizationKey(),
            amountMoney: createTransactionDto.amountMoney,
            transferTitle: createTransactionDto.transferTitle,
        };

        const transaction = this._transactionRepository.create(
            createdTransaction,
        );

        try {
            return this._transactionRepository.save(transaction);
        } catch (error) {
            throw new CreateFailedException(error);
        }
    }

    public async confirmTransaction(
        user: UserEntity,
        confirmTransactionDto: ConfirmTransactionDto,
    ): Promise<UpdateResult | any> {
        const {
            amountMoney: senderAmountMoney,
            senderBill: [{ amountMoney }],
            senderBill: [transaction],
        } = await this._findTransactionByAuthorizationKey(
            confirmTransactionDto.authorizationKey,
            user,
        );

        if (!senderAmountMoney || !amountMoney) {
            throw new TransactionNotFoundException();
        }

        const largerAmountMoney = UtilsService.compareNumbers(
            amountMoney,
            senderAmountMoney,
        );

        if (
            largerAmountMoney === amountMoney &&
            user.userAuth.role !== RoleType.ADMIN
        ) {
            throw new AmountMoneyNotEnoughException();
        }

        return this._updateTransactionAuthorizationStatus(transaction);
    }

    private async _findTransactionByAuthorizationKey(
        authorizationKey: string,
        user: UserEntity,
    ): Promise<BillEntity | undefined> {
        // return sender's

        const queryBuilder = this._billRepository.createQueryBuilder('bill');

        queryBuilder
            .addSelect(
                (subQuery) =>
                    subQuery
                        .select(
                            `COALESCE(
                                TRUNC(
                                    SUM(
                                        CASE WHEN "transactions"."recipient_bill_id" = "bill"."id" 
                                        THEN 1 / 
                                            CASE WHEN "senderBillCurrency"."id" = "recipientBillCurrency"."id" 
                                            THEN 1 
                                            ELSE 
                                                CASE WHEN "recipientBillCurrency"."base" 
                                                THEN "senderBillCurrency"."current_exchange_rate" :: decimal 
                                                ELSE "senderBillCurrency"."current_exchange_rate" :: decimal * "recipientBillCurrency"."current_exchange_rate" :: decimal 
                                                END
                                            END
                                        ELSE -1 
                                    END * "transactions"."amount_money"), 2), '0.00') :: numeric`,
                        )
                        .from(TransactionEntity, 'transactions')
                        .leftJoin('transactions.recipientBill', 'recipientBill')
                        .leftJoin('transactions.senderBill', 'senderBill')
                        .leftJoin(
                            'recipientBill.currency',
                            'recipientBillCurrency',
                        )
                        .leftJoin('senderBill.currency', 'senderBillCurrency')
                        .where(
                            `"bill"."id" IN ("transactions"."sender_bill_id", "transactions"."recipient_bill_id")`,
                        )
                        .andWhere('transactions.authorization_status = true'),
                'bill_amount_money',
            )
            .leftJoinAndSelect('bill.senderBill', 'transaction')
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
}
