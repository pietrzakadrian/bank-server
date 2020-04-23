import { Injectable } from '@nestjs/common';
import { Order } from 'common/constants';
import {
    AmountMoneyNotEnoughException,
    AttemptMakeTransferToMyselfException,
    BillNotFoundException,
} from 'exceptions';
import { BillService } from 'modules/bill/services';
import { UserEntity } from 'modules/user/entities';
import { UtilsService } from 'providers';

import { CreateTransactionDto } from '../dto';
import { TransactionEntity } from '../entities';
import { TransactionRepository } from '../repositories';

@Injectable()
export class TransactionService {
    constructor(
        private readonly _transactionRepository: TransactionRepository,
        private readonly _billService: BillService,
    ) {}

    public async createTransaction(
        user: UserEntity,
        createTransactionDto: CreateTransactionDto,
    ) {
        const {
            recipientAccountBill,
            senderAccountBill,
            amountMoney,
        } = createTransactionDto;

        const [recipientBill, senderBill] = await Promise.all([
            this._billService.findBillByUuidOrAccountBillNumber({
                uuid: recipientAccountBill,
            }),
            this._billService.findBillByUuidOrAccountBillNumber(
                { uuid: senderAccountBill },
                user,
            ),
        ]);

        if (!recipientBill || !senderBill) {
            throw new BillNotFoundException();
        }

        if (recipientAccountBill === senderAccountBill) {
            throw new AttemptMakeTransferToMyselfException();
        }

        if (senderBill.amountMoney < amountMoney) {
            throw new AmountMoneyNotEnoughException();
        }

        // const createdTransaction = {
        //     recipientBill,
        //     senderBill,
        //     ...createTransactionDto,
        // };

        // const transaction = this._transactionRepository.create(
        //     createdTransaction,
        // );

        // try {
        //     return this._transactionRepository.save(transaction);
        // } catch (error) {
        //     throw new CreateFailedException(error);
        // }
    }

    private _generateAuthrorizationKey() {
        return UtilsService.generateRandomString(5);
    }

    private async _findTransactionByAuthorizationKey(
        authorizationKey: string,
        user: UserEntity,
    ): Promise<TransactionEntity | undefined> {
        const queryBuilder = this._transactionRepository.createQueryBuilder(
            'transaction',
        );
        queryBuilder
            .leftJoin('transaction.senderAccountBill', 'senderAccountBill')
            .where('transaction.authorizationKey = :authorizationKey', {
                authorizationKey,
            })
            .andWhere('senderAccountBill.user = :user', {
                user: user.id,
            })
            .orderBy('transactioni.id', Order.DESC);

        return queryBuilder.getOne();
    }
}
