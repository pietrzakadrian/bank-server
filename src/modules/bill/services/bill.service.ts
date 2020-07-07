import { Injectable } from '@nestjs/common';
import { Order } from 'common/constants';
import { PageMetaDto } from 'common/dtos';
import {
  AccountBillNumberGenerationIncorrect,
  CreateFailedException,
  CreateNewBillFailedException,
  CurrencyNotFoundException,
} from 'exceptions';
import {
  BillDto,
  BillsPageDto,
  BillsPageOptionsDto,
  TotalAccountBalanceHistoryPayloadDto,
  TotalAccountBalancePayloadDto,
  TotalAmountMoneyPayloadDto,
} from 'modules/bill/dtos';
import { BillEntity } from 'modules/bill/entities';
import { BillRepository } from 'modules/bill/repositories';
import { CurrencyService } from 'modules/currency/services';
import { TransactionEntity } from 'modules/transaction/entities';
import { TransactionRepository } from 'modules/transaction/repositories';
import { UserEntity } from 'modules/user/entities';
import { UtilsService } from 'utils/services';
import { getConnection } from 'typeorm';

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
  ): Promise<BillsPageDto> {
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
                                        CASE WHEN "transactions"."recipient_bill_id" = "bills"."id" 
                                        THEN 1 *
                                            CASE WHEN "senderBillCurrency"."id" = "recipientBillCurrency"."id" 
                                            THEN 1 
                                            ELSE 
                                                CASE WHEN "recipientBillCurrency"."base" 
                                                THEN 1 / "senderBillCurrency"."current_exchange_rate" :: decimal 
                                                ELSE 1 / "senderBillCurrency"."current_exchange_rate" :: decimal * "recipientBillCurrency"."current_exchange_rate" :: decimal 
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
              '"bills"."id" IN ("transactions"."sender_bill_id", "transactions"."recipient_bill_id")',
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

  public async getBill(user: UserEntity): Promise<BillDto> {
    const queryBuilder = this._billRepository.createQueryBuilder('bill');

    const bill = await queryBuilder
      .leftJoinAndSelect('bill.currency', 'currency')
      .where('bill.user = :user', { user: user.id })
      .orderBy('bill.id', Order.ASC)
      .addSelect(
        (subQuery) =>
          subQuery
            .select(
              `COALESCE(
                                TRUNC(
                                    SUM(
                                        CASE WHEN "transaction"."recipient_bill_id" = "bill"."id" 
                                        THEN 1 * 
                                            CASE WHEN "senderBillCurrency"."id" = "recipientBillCurrency"."id" 
                                            THEN 1 
                                            ELSE 
                                                CASE WHEN "recipientBillCurrency"."base" 
                                                THEN 1 / "senderBillCurrency"."current_exchange_rate" :: decimal 
                                                ELSE 1 / "senderBillCurrency"."current_exchange_rate" :: decimal * "recipientBillCurrency"."current_exchange_rate" :: decimal 
                                                END
                                            END
                                        ELSE -1 
                                    END * "transaction"."amount_money"), 2), '0.00') :: numeric`,
            )
            .from(TransactionEntity, 'transaction')
            .leftJoin('transaction.recipientBill', 'recipientBill')
            .leftJoin('transaction.senderBill', 'senderBill')
            .leftJoin('recipientBill.currency', 'recipientBillCurrency')
            .leftJoin('senderBill.currency', 'senderBillCurrency')
            .where(
              '"bill"."id" IN ("transaction"."sender_bill_id", "transaction"."recipient_bill_id")',
            )
            .andWhere('transaction.authorization_status = true'),
        'bill_amount_money',
      )
      .getOne();

    return bill.toDto();
  }

  public async getTotalAccountBalanceHistory(
    user: UserEntity,
  ): Promise<TotalAccountBalanceHistoryPayloadDto> {
    const queryBuilder = await getConnection().createQueryBuilder();

    const [{ accountBalanceHistory }] = await queryBuilder
      .select(
        `array_agg(balance ORDER BY id ${Order.ASC})`,
        'accountBalanceHistory',
      )
      .from(
        (subQuery) =>
          subQuery
            .select(
              `
                                0 AS id,
                                0 AS balance
                            UNION ALL
                            SELECT
                                "transactions"."id",
                                COALESCE(
                                    TRUNC(
                                        SUM(
                                            CASE WHEN "recipientUser"."id" = :userId 
                                            THEN 1 * 
                                                CASE WHEN "senderBillCurrency"."id" = "recipientCurrencyMain"."id" 
                                                THEN 1 
                                                ELSE 
                                                    CASE WHEN "recipientCurrencyMain"."base" 
                                                    THEN 1 / "senderBillCurrency"."current_exchange_rate" :: decimal 
                                                    ELSE 1 / "senderBillCurrency"."current_exchange_rate" :: decimal * "recipientCurrencyMain"."current_exchange_rate" :: decimal 
                                                    END 
                                                END 
                                            ELSE -1 *
                                                CASE WHEN "senderBillCurrency"."id" = "senderCurrencyMain"."id" 
                                                THEN 1 
                                                ELSE 
                                                    CASE WHEN "senderCurrencyMain"."base" 
                                                        THEN "senderBillCurrency"."current_exchange_rate" :: decimal 
                                                        ELSE 1 / "senderBillCurrency"."current_exchange_rate" :: decimal * "senderCurrencyMain"."current_exchange_rate" :: decimal 
                                                        END 
                                                    END 
                                                END * "transactions"."amount_money"
                                        ) OVER (
                                            ORDER BY "transactions"."updated_at" ${Order.ASC}
                                        ), 2), 0) AS balance`,
            )
            .from(TransactionEntity, 'transactions')
            .leftJoin('transactions.senderBill', 'senderBill')
            .leftJoin('transactions.recipientBill', 'recipientBill')
            .leftJoin('senderBill.currency', 'senderBillCurrency')
            .leftJoin('senderBill.user', 'senderUser')
            .leftJoin('recipientBill.user', 'recipientUser')
            .leftJoin('recipientUser.userConfig', 'recipientUserConfig')
            .leftJoin('senderUser.userConfig', 'senderUserConfig')
            .leftJoin('recipientUserConfig.currency', 'recipientCurrencyMain')
            .leftJoin('senderUserConfig.currency', 'senderCurrencyMain')
            .where(':userId IN ("recipientUser"."id", "senderUser"."id")')
            .andWhere('transactions.authorization_status = true')
            .orderBy('balance', Order.DESC)
            .limit(50)
            .setParameter('userId', user.id),
        'transactions',
      )
      .execute();

    return new TotalAccountBalanceHistoryPayloadDto(accountBalanceHistory);
  }

  public async getTotalAmountMoney(
    user: UserEntity,
  ): Promise<TotalAmountMoneyPayloadDto> {
    const queryBuilder = this._transactionRepository.createQueryBuilder(
      'transactions',
    );

    const [amountMoney] = await queryBuilder
      .select(
        `
                (
                    SELECT c.name AS "currencyName" FROM currency AS c
                    LEFT JOIN users_config AS uc ON uc.main_currency_id = c.id
                    WHERE uc.user_id = :userId
                ),
                COALESCE(
                    TRUNC(
                        SUM(
                            CASE WHEN "recipientUser"."id" = :userId 
                            THEN 1 * 
                                CASE WHEN "senderBillCurrency"."id" = "recipientCurrencyMain"."id" 
                                THEN 1 
                                ELSE 
                                    CASE WHEN "recipientCurrencyMain"."base" 
                                    THEN 1 / "senderBillCurrency"."current_exchange_rate" :: decimal 
                                    ELSE 1 / "senderBillCurrency"."current_exchange_rate" :: decimal * "recipientCurrencyMain"."current_exchange_rate" :: decimal 
                                    END 
                                END 
                            ELSE -1 * 
                                CASE WHEN "senderBillCurrency"."id" = "senderCurrencyMain"."id" 
                                THEN 1 
                                ELSE 
                                    CASE WHEN "senderCurrencyMain"."base" 
                                    THEN 1 / "senderBillCurrency"."current_exchange_rate" :: decimal 
                                    ELSE 1 / "senderBillCurrency"."current_exchange_rate" :: decimal * "senderCurrencyMain"."current_exchange_rate" :: decimal 
                                    END 
                                END 
                            END * "transactions"."amount_money"
                        ), 2), '0.00') :: numeric`,
        'amountMoney',
      )
      .leftJoin('transactions.senderBill', 'senderBill')
      .leftJoin('transactions.recipientBill', 'recipientBill')
      .leftJoin('senderBill.currency', 'senderBillCurrency')
      .leftJoin('senderBill.user', 'senderUser')
      .leftJoin('recipientBill.user', 'recipientUser')
      .leftJoin('recipientUser.userConfig', 'recipientUserConfig')
      .leftJoin('senderUser.userConfig', 'senderUserConfig')
      .leftJoin('recipientUserConfig.currency', 'recipientCurrencyMain')
      .leftJoin('senderUserConfig.currency', 'senderCurrencyMain')
      .where(':userId IN ("recipientUser"."id", "senderUser"."id")')
      .andWhere('transactions.authorization_status = true')
      .setParameter('userId', user.id)
      .execute();

    return new TotalAmountMoneyPayloadDto(amountMoney);
  }

  public async getTotalAccountBalance(
    user: UserEntity,
  ): Promise<TotalAccountBalancePayloadDto> {
    const queryBuilder = this._transactionRepository.createQueryBuilder(
      'transactions',
    );

    const [accountBalance] = await queryBuilder
      .select(
        `(
                    SELECT c.name AS "currencyName" FROM currency AS c
                    LEFT JOIN users_config AS uc ON uc.main_currency_id = c.id
                    WHERE uc.user_id = :userId
                ),
                COALESCE(
                    TRUNC(
                        SUM(
                            1 * CASE WHEN "senderBillCurrency"."id" = "recipientCurrencyMain"."id"
                                THEN 1 
                                ELSE
                                    CASE WHEN "recipientCurrencyMain"."base" 
                                    THEN 1 / "senderBillCurrency"."current_exchange_rate" :: decimal 
                                    ELSE 1 / "senderBillCurrency"."current_exchange_rate" :: decimal * "recipientCurrencyMain"."current_exchange_rate" :: decimal 
                                    END 
                                END * "transactions"."amount_money"
                        ) FILTER (
                            WHERE "recipientUser"."id" = :userId
                        ), 2), '0.00') :: numeric`,
        'revenues',
      )
      .addSelect(
        `COALESCE(
                    TRUNC(
                        SUM(
                            1 * CASE WHEN "senderBillCurrency"."id" = "senderCurrencyMain"."id" 
                                THEN 1 
                                ELSE 
                                    CASE WHEN "senderCurrencyMain"."base"
                                    THEN 1 / "senderBillCurrency"."current_exchange_rate" :: decimal 
                                    ELSE 1 / "senderBillCurrency"."current_exchange_rate" :: decimal * "senderCurrencyMain"."current_exchange_rate" :: decimal 
                                    END 
                                END * "transactions"."amount_money"
                        ) FILTER (
                            WHERE "senderUser"."id" = :userId
                        ), 2), '0.00') :: numeric`,
        'expenses',
      )
      .leftJoin('transactions.senderBill', 'senderBill')
      .leftJoin('transactions.recipientBill', 'recipientBill')
      .leftJoin('senderBill.currency', 'senderBillCurrency')
      .leftJoin('senderBill.user', 'senderUser')
      .leftJoin('recipientBill.user', 'recipientUser')
      .leftJoin('recipientUser.userConfig', 'recipientUserConfig')
      .leftJoin('senderUser.userConfig', 'senderUserConfig')
      .leftJoin('recipientUserConfig.currency', 'recipientCurrencyMain')
      .leftJoin('senderUserConfig.currency', 'senderCurrencyMain')
      .where(':userId IN ("recipientUser"."id", "senderUser"."id")')
      .andWhere('transactions.authorization_status = true')
      .setParameter('userId', user.id)
      .execute();

    return new TotalAccountBalancePayloadDto(accountBalance);
  }

  public async createAccountBill(createdUser): Promise<BillEntity> {
    console.log('TRZECI');

    const [accountBillNumber, currency] = await Promise.all([
      this._createBillNumber(),
      this._currencyService.findCurrency({ uuid: createdUser.currency }),
    ]);

    if (!currency) {
      throw new CurrencyNotFoundException();
    }

    const {
      meta: { itemCount },
    } = await this.getBills(createdUser.user, { skip: 0 });

    if (itemCount >= 5) {
      throw new CreateNewBillFailedException();
    }

    const createdBill: BillEntity = {
      ...createdUser,
      accountBillNumber,
      currency,
      amountMoney: '0.00', // this value is not saved to the database. It is only used to display correctly in payload
    };

    const bill = this._billRepository.create(createdBill);

    try {
      return this._billRepository.save(bill);
    } catch (error) {
      throw new CreateFailedException(error);
    }
  }

  public async searchBill(
    accountBillNumber: string,
    pageOptionsDto: BillsPageOptionsDto,
    user?: UserEntity,
  ): Promise<BillsPageDto | undefined> {
    const queryBuilder = this._billRepository.createQueryBuilder('bills');

    queryBuilder
      .select([
        'bills',
        'currency',
        'user.firstName',
        'user.lastName',
        'user.avatar',
      ])
      .leftJoin('bills.currency', 'currency')
      .leftJoin('bills.user', 'user')
      .where('bills.accountBillNumber LIKE :accountBillNumber', {
        accountBillNumber: `${accountBillNumber}%`,
      })
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getManyAndCount();

    if (user) {
      queryBuilder.andWhere('user.id != :user', { user: user.id });
    }

    const [bills, billsCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: billsCount,
    });

    return new BillsPageDto(bills.toDtos(), pageMetaDto);
  }

  public async findBill(
    uuid: string,
    user?: UserEntity,
  ): Promise<BillEntity | undefined> {
    const queryBuilder = this._billRepository.createQueryBuilder('bill');

    queryBuilder
      .where('bill.uuid = :uuid', { uuid })
      .leftJoinAndSelect('bill.currency', 'currency')
      .leftJoinAndSelect('bill.user', 'user')
      .addSelect(
        (subQuery) =>
          subQuery
            .select(
              `COALESCE(
                                TRUNC(
                                    SUM(
                                        CASE WHEN "transactions"."recipient_bill_id" = "bill"."id" 
                                        THEN 1 * 
                                            CASE WHEN "senderBillCurrency"."id" = "recipientBillCurrency"."id" 
                                            THEN 1 
                                            ELSE 
                                                CASE WHEN "recipientBillCurrency"."base" 
                                                THEN 1 / "senderBillCurrency"."current_exchange_rate" :: decimal 
                                                ELSE 1 / "senderBillCurrency"."current_exchange_rate" :: decimal * "recipientBillCurrency"."current_exchange_rate" :: decimal 
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
              '"bill"."id" IN ("transactions"."sender_bill_id", "transactions"."recipient_bill_id")',
            )
            .andWhere('transactions.authorization_status = true'),
        'bill_amount_money',
      );

    if (user) {
      queryBuilder.andWhere('bill.user = :user', { user: user.id });
    }

    return queryBuilder.getOne();
  }

  private async _createBillNumber(): Promise<string> {
    const accountBillNumber = this._generateBillNumber();
    const { data } = await this.searchBill(accountBillNumber, { skip: 0 });

    try {
      return data.length ? await this._createBillNumber() : accountBillNumber;
    } catch (error) {
      throw new AccountBillNumberGenerationIncorrect(error);
    }
  }

  private _generateBillNumber(): string {
    const checksum = UtilsService.generateRandomInteger(10, 99);
    const bankOrganizationalUnitNumber = 28229297;
    const customerAccountNumber = UtilsService.generateRandomInteger(
      1e15,
      9e15,
    );

    return `${checksum}${bankOrganizationalUnitNumber}${customerAccountNumber}`;
  }
}
