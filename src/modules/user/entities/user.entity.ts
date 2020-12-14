import { AbstractEntity } from 'common/entities';
import { BillEntity } from 'modules/bill/entities/bill.entity';
import { UserDto } from 'modules/user/dtos';
import { UserAuthEntity, UserConfigEntity } from 'modules/user/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { MessageEntity } from 'modules/message/entities';
import { UserAuthForgottenPasswordEntity } from './user-auth-forgotten-password.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar?: string;

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
  bills: BillEntity[];

  @OneToMany(() => MessageEntity, (message: MessageEntity) => message.sender, {
    nullable: false,
  })
  sender: MessageEntity[];

  @OneToMany(
    () => MessageEntity,
    (message: MessageEntity) => message.recipient,
    { nullable: false },
  )
  recipient: MessageEntity[];

  @OneToMany(
    () => UserAuthForgottenPasswordEntity,
    (UserAuthForgottenPassword: UserAuthForgottenPasswordEntity) =>
      UserAuthForgottenPassword.user,
    { cascade: true },
  )
  public userAuthForgottenPassword?: UserAuthForgottenPasswordEntity[];

  dtoClass = UserDto;
}
