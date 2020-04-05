import { AbstractEntity } from 'common/entities';
import { CurrencyDto } from 'modules/currency/dto';
import { Column, Entity, UpdateDateColumn } from 'typeorm';

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

    dtoClass = CurrencyDto;
}
