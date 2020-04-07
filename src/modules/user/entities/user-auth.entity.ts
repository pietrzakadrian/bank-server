import { RoleType } from 'common/constants';
import { AbstractEntity } from 'common/entities';
import { UserAuthDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entities';
import { PasswordTransformer } from 'modules/user/transformers';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users_auth' })
export class UserAuthEntity extends AbstractEntity<UserAuthDto> {
    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role: RoleType;

    @Column({ unique: true })
    pinCode: number;

    @Column({ transformer: new PasswordTransformer() })
    password: string;

    @Column({ nullable: true })
    lastSuccessfulLoggedDate: Date;

    @Column({ nullable: true })
    lastFailedLoggedDate: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
    })
    updatedAt: Date;

    @OneToOne(() => UserEntity, (user: UserEntity) => user.userAuth, {
        cascade: true,
        eager: true,
        nullable: false,
    })
    @JoinColumn()
    user: UserEntity;

    dtoClass = UserAuthDto;
}
