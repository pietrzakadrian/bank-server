import { AbstractEntity } from 'common/entities';
import { BillEntity } from 'modules/bill/entities/bill.entity';
import { CurrencyDto } from 'modules/currency/dto';
import { UserConfigEntity } from 'modules/user/entities';
import { Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'currency' })
export class CurrencyEntity extends AbstractEntity<CurrencyDto> {
    @Column({ unique: true })
    name: string;

    @Column('float')
    currentExchangeRate: number;

    @Column({ default: false })
    base: boolean;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
    })
    updatedAt: Date;

    @OneToMany(() => BillEntity, (bill: BillEntity) => bill.currency, {
        nullable: false,
    })
    bill: BillEntity[];

    @OneToMany(
        () => UserConfigEntity,
        (userConfig: UserConfigEntity) => userConfig.currency,
        { nullable: false },
    )
    userConfig: UserConfigEntity[];

    dtoClass = CurrencyDto;
}
