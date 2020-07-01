import { AbstractEntity } from 'common/entities';
import { BillDto } from 'modules/bill/dtos';
import { CurrencyEntity } from 'modules/currency/entities';
import { TransactionEntity } from 'modules/transaction/entities';
import { UserEntity } from 'modules/user/entities';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'bills' })
export class BillEntity extends AbstractEntity<BillDto> {
  @Column({ unique: true, length: 26 })
  accountBillNumber: string;

  /**
   * This is a @Virtual column.
   * Used only to map entity correctly using the .getManyAndCount() method.
   */
  @Column({ select: false, insert: false, update: false, nullable: true })
  readonly amountMoney: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.bills, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(
    () => CurrencyEntity,
    (currency: CurrencyEntity) => currency.bill,
    { nullable: false, onDelete: 'CASCADE' },
  )
  currency: CurrencyEntity;

  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.recipientBill,
    {
      nullable: false,
    },
  )
  recipientBill: TransactionEntity[];

  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.senderBill,
    {
      nullable: false,
    },
  )
  senderBill: TransactionEntity[];

  dtoClass = BillDto;
}
