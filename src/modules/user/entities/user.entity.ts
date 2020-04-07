import { AbstractEntity } from 'common/entities';
import { BillEntity } from 'modules/bill/entities/bill.entity';
import { UserDto } from 'modules/user/dto';
import { UserAuthEntity } from 'modules/user/entities';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    UpdateDateColumn,
} from 'typeorm';

import { UserConfigEntity } from './user-config.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true, nullable: true })
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    @CreateDateColumn({
        type: 'timestamp with time zone',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
    })
    updatedAt: Date;

    @OneToOne(() => UserAuthEntity, (userAuth: UserAuthEntity) => userAuth.user)
    userAuth: UserAuthEntity;

    @OneToOne(
        () => UserConfigEntity,
        (userConfig: UserConfigEntity) => userConfig.user,
    )
    userConfig: UserConfigEntity;

    @OneToMany(() => BillEntity, (bill: BillEntity) => bill.user, {
        nullable: false,
    })
    bill: BillEntity[];

    dtoClass = UserDto;
}
