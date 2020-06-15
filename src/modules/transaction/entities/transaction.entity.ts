import { AbstractEntity } from 'common/entities';
import { BillEntity } from 'modules/bill/entities/bill.entity';
import { TransactionDto } from 'modules/transaction/dto';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity extends AbstractEntity<TransactionDto> {
    @Column('decimal', { precision: 13, scale: 2, default: 0, nullable: false })
    amountMoney: number;

    @Column()
    transferTitle: string;

    @Column()
    authorizationKey: string;

    @Column({ default: false })
    authorizationStatus: boolean;

    @CreateDateColumn({
        type: 'timestamp with time zone',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
    })
    updatedAt: Date;

    @ManyToOne(() => BillEntity, (bill: BillEntity) => bill.senderBill, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    senderBill: BillEntity;

    @ManyToOne(() => BillEntity, (bill: BillEntity) => bill.recipientBill, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    recipientBill: BillEntity;

    dtoClass = TransactionDto;
}
