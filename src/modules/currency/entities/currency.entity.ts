import { AbstractEntity } from 'common/entities';
import { BillEntity } from 'modules/bill/entities/bill.entity';
import { CurrencyDto } from 'modules/currency/dto';
import { Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'currency' })
export class CurrencyEntity extends AbstractEntity<CurrencyDto> {
    @Column()
    name: string;

    @Column()
    currentExchangeRate: number;

    @Column()
    main: boolean;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
    })
    updatedAt: Date;

    @OneToMany(() => BillEntity, (bill: BillEntity) => bill.currency, {
        nullable: false,
    })
    bill: BillEntity[];

    dtoClass = CurrencyDto;
}
