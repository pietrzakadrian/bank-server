import { Injectable } from '@nestjs/common';
import { Order, RoleType } from 'common/constants';
import { PageMetaDto } from 'common/dtos';
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
} from 'modules/transaction/dtos';
import { TransactionEntity } from 'modules/transaction/entities';
import { TransactionRepository } from 'modules/transaction/repositories';
import { UserEntity } from 'modules/user/entities';
import { UtilsService, ValidatorService } from 'utils/services';
import { UpdateResult } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TransactionService {
  private _emailSubject = {
    en: 'Payment authorization',
    de: 'Zahlungsermächtigung',
    pl: 'Autoryzacja płatności',
  };

  constructor(
    private readonly _transactionRepository: TransactionRepository,
    private readonly _billRepository: BillRepository,
    private readonly _billService: BillService,
    private readonly _validatorService: ValidatorService,
    private readonly _mailerService: MailerService,
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
        'recipientUser.uuid',
        'recipientUser.firstName',
        'recipientUser.lastName',
        'recipientUser.avatar',
        'senderUser.uuid',
        'senderUser.firstName',
        'senderUser.lastName',
        'senderUser.avatar',
      ])
      .leftJoinAndSelect('transactions.senderBill', 'senderBill')
      .leftJoinAndSelect('transactions.recipientBill', 'recipientBill')
      .leftJoin('recipientBill.user', 'recipientUser')
      .leftJoinAndSelect('recipientBill.currency', 'recipientBillCurrency')
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

    queryBuilder.orderBy('transaction.id', Order.DESC);

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

    this._validatorService.isCorrectRecipient(
      senderBill?.id,
      recipientBill?.id,
    );

    // if (!recipientBill || !senderBill) {
    //   throw new BillNotFoundException();
    // }

    // if (recipientBill.id === senderBill.id) {
    //   throw new AttemptMakeTransferToMyselfException();
    // }

    this._validatorService.isCorrectAmountMoney(
      user.userAuth.role,
      senderBill.amountMoney,
      createTransactionDto.amountMoney,
    );

    // if (
    //   user.userAuth.role !== RoleType.ADMIN &&
    //   (Number(senderBill.amountMoney) < createTransactionDto.amountMoney ||
    //     createTransactionDto.amountMoney <= 0)
    // ) {
    //   throw new AmountMoneyNotEnoughException();
    // }

    const createdTransaction = {
      recipientBill,
      senderBill,
      authorizationKey: authorizationKey ?? this._generateAuthrorizationKey(),
      amountMoney: createTransactionDto.amountMoney,
      transferTitle: createTransactionDto.transferTitle,
    };

    const transaction = this._transactionRepository.create(createdTransaction);

    this._mailerService
      .sendMail({
        to: senderBill.user.email,
        from: 'payment@bank.pietrzakadrian.com',
        subject: this._emailSubject[createTransactionDto.locale],
        template:
          __dirname +
          `/../templates/transaction.template.${createTransactionDto.locale}.hbs`,
        context: {
          amountMoney: createTransactionDto.amountMoney.toLocaleString(
            undefined,
            { minimumFractionDigits: 2 },
          ),
          currencyName: senderBill.currency.name,
          recipient: `${recipientBill.user.firstName} ${recipientBill.user.lastName}`,
          authorizationKey: createdTransaction.authorizationKey,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
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
  ): Promise<UpdateResult | any> {
    const createdTransaction = await this._findTransactionByAuthorizationKey(
      confirmTransactionDto.authorizationKey,
      user,
    );

    if (!createdTransaction) {
      throw new TransactionNotFoundException();
    }

    const {
      amountMoney: senderAmountMoney,
      senderBill: [{ amountMoney: transactionAmountMoney }],
      senderBill: [transaction],
    } = createdTransaction;

    // if (
    //   Number(senderAmountMoney) < amountMoney &&
    //   user.userAuth.role !== RoleType.ADMIN
    // ) {
    //   throw new AmountMoneyNotEnoughException();
    // }

    this._validatorService.isCorrectAmountMoney(
      user.userAuth.role,
      senderAmountMoney,
      transactionAmountMoney,
    );

    return this._updateTransactionAuthorizationStatus(transaction);
  }

  private async _findTransactionByAuthorizationKey(
    authorizationKey: string,
    user: UserEntity,
  ): Promise<BillEntity | undefined> {
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
            .leftJoin('recipientBill.currency', 'recipientBillCurrency')
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
