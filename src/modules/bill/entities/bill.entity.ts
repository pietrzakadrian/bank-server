import { AbstractEntity } from 'common/entities';
import { BillDto } from 'modules/bill/dto';
import { CurrencyEntity } from 'modules/currency/entities';
import { UserEntity } from 'modules/user/entities';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'bills' })
export class BillEntity extends AbstractEntity<BillDto> {
    @Column()
    accountBill: string;

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

    dtoClass = BillDto;
}
