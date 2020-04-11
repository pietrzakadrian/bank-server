import { AbstractEntity } from 'common/entities';
import { UserConfigDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entities';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users_config' })
export class UserConfigEntity extends AbstractEntity<UserConfigDto> {
    @Column({ default: false })
    notificationStatus: boolean;

    @Column({ default: 0 })
    notificationCount: number;

    @Column({ default: false })
    messageStatus: boolean;

    @Column({ default: 0 })
    messageCount: number;

    @Column({ nullable: true })
    lastPresentLoggedDate: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
    })
    updatedAt: Date;

    @OneToOne(() => UserEntity, (user: UserEntity) => user.userConfig, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: UserEntity;

    dtoClass = UserConfigDto;
}
