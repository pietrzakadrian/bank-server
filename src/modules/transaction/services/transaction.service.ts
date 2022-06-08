import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from 'common/constants';
import { PageMetaDto } from 'common/dtos';
import { format } from 'date-fns';
import {
  CreateFailedException,
  TransactionNotFoundException,
} from 'exceptions';
import * as fs from 'fs';
import handlebars from 'handlebars';
import * as pdf from 'html-pdf';
import { BillEntity } from 'modules/bill/entities';
import { BillRepository } from 'modules/bill/repositories';
import { BillService } from 'modules/bill/services';
import { LanguageService } from 'modules/language/services';
import {
  ConfirmTransactionDto,
  CreateTransactionDto,
  TransactionsPageDto,
  TransactionsPageOptionsDto,
} from 'modules/transaction/dtos';
import { TransactionEntity } from 'modules/transaction/entities';
import { TransactionRepository } from 'modules/transaction/repositories';
import { UserEntity } from 'modules/user/entities';
import { UserConfigService } from 'modules/user/services';
import { Readable } from 'stream';
import { UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UtilsService, ValidatorService } from 'utils/services';

@Injectable()
export class TransactionService {
  private readonly _logger = new Logger(TransactionService.name);
  private readonly _configService = new ConfigService();
  private readonly _emailSubject = {
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
    private readonly _userConfigService: UserConfigService,
    private readonly _languageService: LanguageService,
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
      .addOrderBy('transactions.id', pageOptionsDto.order)
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
      recipient: UserEntity;
      sender: UserEntity;
      user: UserEntity;
      authorizationStatus: boolean;
    }>,
  ): Promise<TransactionEntity | undefined> {
    const queryBuilder = this._transactionRepository.createQueryBuilder(
      'transaction',
    );

    queryBuilder.orderBy('transaction.id', Order.DESC);

    if (options.recipient) {
      queryBuilder
        .leftJoin('transaction.recipientBill', 'recipientBill')
        .leftJoin('recipientBill.user', 'recipientUser')
        .andWhere('recipientUser.id = :user', { user: options.recipient.id });
    }

    if (options.sender) {
      queryBuilder
        .leftJoin('transaction.senderBill', 'senderBill')
        .leftJoin('senderBill.user', 'senderUser')
        .andWhere('senderUser.id = :user', { user: options.sender.id });
    }

    if (options.uuid) {
      queryBuilder.andWhere('transaction.uuid = :uuid', {
        uuid: options.uuid,
      });
    }

    if (options.authorizationStatus) {
      queryBuilder.andWhere(
        'transaction.authorizationStatus = :authorizationStatus',
        { authorizationStatus: options.authorizationStatus },
      );
    }

    if (options.authorizationKey) {
      queryBuilder.andWhere(
        'transaction.authorizationKey = :authorizationKey',
        { authorizationKey: options.authorizationKey },
      );
    }

    if (options.user) {
      queryBuilder
        .leftJoinAndSelect('transaction.senderBill', 'senderBill')
        .leftJoinAndSelect('senderBill.user', 'senderUser')
        .leftJoinAndSelect('transaction.recipientBill', 'recipientBill')
        .leftJoinAndSelect('recipientBill.user', 'recipientUser')
        .leftJoinAndSelect('senderBill.currency', 'senderBillCurrency')
        .andWhere('(senderUser.id = :user OR recipientUser.id = :user)', {
          user: options.user.id,
        });
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

    this._validatorService.isCorrectAmountMoney(
      user.userAuth.role,
      senderBill.amountMoney,
      createTransactionDto.amountMoney,
    );

    const createdTransaction = {
      recipientBill,
      senderBill,
      authorizationKey: authorizationKey ?? this._generateAuthrorizationKey(),
      amountMoney: createTransactionDto.amountMoney,
      transferTitle: createTransactionDto.transferTitle,
    };

    const transaction = this._transactionRepository.create(createdTransaction);

    const isHigherRole = this._validatorService.isHigherRole(
      user.userAuth.role,
    );

    if (!isHigherRole) {
      await this.sendEmailWithAuthorizationKey(
        createdTransaction,
        createTransactionDto,
        senderBill,
        recipientBill,
      );
    }

    try {
      return this._transactionRepository.save(transaction);
    } catch (error) {
      throw new CreateFailedException(error);
    }
  }

  private async sendEmailWithAuthorizationKey(
    createdTransaction,
    createTransactionDto: CreateTransactionDto,
    senderBill: BillEntity,
    recipientBill: BillEntity,
  ): Promise<void> {
    try {
      const email = await this._mailerService.sendMail({
        to: senderBill.user.email,
        from: this._configService.get('EMAIL_ADDRESS'),
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
      });

      this._logger.log(
        `An email with the authorization code has been sent to: ${email.accepted}`,
      );
    } catch (error) {
      this._logger.error(
        `An email with a confirmation code has not been sent. Theoretical recipient: ${senderBill.user.email}`,
      );
    }
  }

  @Transactional()
  public async confirmTransaction(
    user: UserEntity,
    confirmTransactionDto: ConfirmTransactionDto,
  ): Promise<void> {
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

    this._validatorService.isCorrectAmountMoney(
      user.userAuth.role,
      senderAmountMoney,
      transactionAmountMoney,
    );

    try {
      await this._updateTransactionAuthorizationStatus(transaction);
      await this._userConfigService.setNotification(
        transaction.recipientBill.user.userConfig,
      );
    } catch (error) {
      throw new CreateFailedException(error);
    }
  }

  /**
   * NOTE: This query is created by the bill repository because it must include the current amount of the sender's money as well.
   * This method is called when the user confirms the transfer.
   * Attaching the current balance of the sender's account is necessary to validation before confirming the transfer.
   */
  private async _findTransactionByAuthorizationKey(
    authorizationKey: string,
    sender: UserEntity,
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
      .leftJoinAndSelect('transaction.recipientBill', 'recipientBill')
      .leftJoinAndSelect('recipientBill.user', 'recipientUser')
      .leftJoinAndSelect('recipientUser.userConfig', 'userConfig')
      .leftJoinAndSelect('bill.currency', 'currency')
      .where('transaction.authorizationKey = :authorizationKey', {
        authorizationKey,
      })
      .andWhere('bill.user = :user', {
        user: sender.id,
      })
      .andWhere('transaction.authorizationStatus = false')
      .orderBy('transaction.id', Order.DESC);

    return queryBuilder.getOne();
  }

  private async _updateTransactionAuthorizationStatus(
    transaction: TransactionEntity,
  ): Promise<UpdateResult> {
    const queryBuilder = this._transactionRepository.createQueryBuilder(
      'transaction',
    );

    return queryBuilder
      .update()
      .set({ authorizationStatus: true })
      .where('id = :id', { id: transaction.id })
      .execute();
  }

  private _generateAuthrorizationKey() {
    return UtilsService.generateRandomString(5);
  }

  public async getConfirmationDocumentFile(
    user: UserEntity,
    uuid: string,
    locale: string,
  ): Promise<string> {
    const transaction = await this.getTransaction({
      user,
      uuid,
      authorizationStatus: true,
    });

    if (!transaction) {
      throw new TransactionNotFoundException();
    }

    const variables = {
      date: format(transaction.updatedAt, 'dd.MM.yyyy, HH:mm'),
      senderName: `${transaction.senderBill.user.firstName} ${transaction.senderBill.user.lastName}`,
      recipientName: `${transaction.recipientBill.user.firstName} ${transaction.recipientBill.user.lastName}`,
      amountMoney: transaction.amountMoney,
      currencyName: transaction.senderBill.currency.name,
    };

    const content = await this._getConfirmationFileContent(locale);
    return this._getCompiledContent(content, variables);
  }

  public getReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  public async htmlToPdfBuffer(html: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      pdf.create(html).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }

  private async _getConfirmationFileContent(locale: string): Promise<string> {
    try {
      const data = await fs.promises.readFile(
        __dirname + `/../templates/confirmation.template.${locale}.hbs`,
        'utf8',
      );

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * TODO: This method is re-declared somewhere and fails the DRY principle.
   * Transfer it to a separate service
   */
  private _getCompiledContent(content: string, variables): any {
    const template = handlebars.compile(content.toString());

    return template(variables);
  }
}
