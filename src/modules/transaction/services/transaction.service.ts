import { Injectable } from '@nestjs/common';
import {
    AuthorizationKeyGenerationIncorrect,
    // CreateFailedException,
} from 'exceptions';
import { UtilsService } from 'providers';

// import { ConfirmTransactionDto, CreateTransactionDto } from '../dto';
import { TransactionEntity } from '../entities';
import { TransactionRepository } from '../repositories';

@Injectable()
export class TransactionService {
    constructor(
        private readonly _transactionRepository: TransactionRepository,
    ) {}

    // public async createTransaction(
    //     createTransactionDto: CreateTransactionDto,
    // ): Promise<any> {
    //     const transaction = this._transactionRepository.create(
    //         createdTransaction,
    //     );

    //     try {
    //         return this._transactionRepository.save(transaction);
    //     } catch (error) {
    //         throw new CreateFailedException(error);
    //     }
    // }

    // public async confirmTransaction(
    //     confirmTransactionDto: ConfirmTransactionDto,
    // ): Promise<any> {}

    private async _createAuthorizationKey() {
        const authorizationKey = this._generateAuthrorizationKey();
        const transactionEntity = await this._findTransactionByAuthorizationKey(
            { authorizationKey },
        );

        try {
            return transactionEntity
                ? await this._createAuthorizationKey()
                : authorizationKey;
        } catch (error) {
            throw new AuthorizationKeyGenerationIncorrect(error);
        }
    }

    private _generateAuthrorizationKey() {
        return UtilsService.generateRandomString(5);
    }

    private async _findTransactionByAuthorizationKey(
        options: Partial<{
            authorizationKey: string;
        }>,
    ): Promise<TransactionEntity | undefined | void> {
        const { authorizationKey } = options;
        const queryBuilder = this._transactionRepository.createQueryBuilder(
            'transaction',
        );

        if (authorizationKey) {
            queryBuilder.where(
                'transaction.authorizationKey = :authorizationKey',
                { authorizationKey },
            );
        }
        return queryBuilder.getOne();
    }
}
