import { Injectable, NestMiddleware } from '@nestjs/common';
import { RoleType } from 'common/constants';
import { Response } from 'express';
import { IUserLoginBodyRequest } from 'interfaces';
import { BillService } from 'modules/bill/services';
import { TransactionService } from 'modules/transaction/services';
import { UserAuthService } from 'modules/user/services';

@Injectable()
export class RegisterPromotionMiddleware implements NestMiddleware {
    private readonly _promotionKey = `PROMO10`;

    constructor(
        private readonly _billService: BillService,
        private readonly _transactionService: TransactionService,
        private readonly _userAuthService: UserAuthService,
    ) {}

    async use(req: IUserLoginBodyRequest, res: Response, next: Function) {
        const { pinCode } = req.body;
        const [user, rootUser] = await Promise.all([
            this._userAuthService.findUserAuth({ pinCode }),
            this._userAuthService.findUserAuth({ role: RoleType.ADMIN }),
        ]);

        if (!user || !rootUser) {
            return next();
        }

        const transaction = await this._transactionService.getTransaction({
            recipientUser: user,
            authorizationKey: this._promotionKey,
        });

        if (transaction) {
            return next();
        }

        const [senderBill, recipientBill] = await Promise.all([
            this._billService.getBill(rootUser),
            this._billService.getBill(user),
        ]);

        const createdTransaction = {
            amountMoney: 10,
            transferTitle: 'Create an account',
            recipientAccountBill: recipientBill.uuid,
            senderAccountBill: senderBill.uuid,
        };

        await this._transactionService.createTransaction(
            rootUser,
            createdTransaction,
            this._promotionKey,
        );
        await this._transactionService.confirmTransaction(
            rootUser,
            { authorizationKey: this._promotionKey },
            true,
        );

        next();
    }
}
