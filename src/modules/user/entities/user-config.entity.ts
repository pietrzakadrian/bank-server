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
    @Column()
    notificationStatus: boolean;

    @Column()
    notificationCount: number;

    @Column()
    messageStatus: boolean;

    @Column()
    messageCount: number;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
    })
    updatedAt: Date;

    @OneToOne(() => UserEntity, (user: UserEntity) => user.userConfig, {
        cascade: true,
        eager: true,
        nullable: false,
    })
    @JoinColumn()
    user: UserEntity;

    dtoClass = UserConfigDto;
}
