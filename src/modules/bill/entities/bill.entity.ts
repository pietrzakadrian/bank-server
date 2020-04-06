import { AbstractEntity } from 'common/entities';
import { BillDto } from 'modules/bill/dto';
import { CurrencyEntity } from 'modules/currency/entities';
import { TransactionEntity } from 'modules/transaction/entities';
import { UserEntity } from 'modules/user/entities';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'bills' })
export class BillEntity extends AbstractEntity<BillDto> {
    @Column()
    accountBillNumber: string;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.bill, {
        nullable: false,
    })
    user: UserEntity;

    @ManyToOne(
        () => CurrencyEntity,
        (currency: CurrencyEntity) => currency.bill,
        {
            nullable: false,
        },
    )
    currency: CurrencyEntity;

    @OneToMany(
        () => TransactionEntity,
        (transaction: TransactionEntity) => transaction.recipientAccountBill,
        {
            nullable: false,
        },
    )
    recipientAccountBill: TransactionEntity[];

    @OneToMany(
        () => TransactionEntity,
        (transaction: TransactionEntity) => transaction.senderAccountBill,
        {
            nullable: false,
        },
    )
    senderAccountBill: TransactionEntity[];

    dtoClass = BillDto;
}
