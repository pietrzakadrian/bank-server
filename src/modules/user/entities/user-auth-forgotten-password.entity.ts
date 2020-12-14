import { AbstractEntity } from 'common/entities';
import { UserAuthForgottenPasswordDto } from '../dtos';
import { UserEntity } from '.';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users_auth_forgotten_passwords' })
export class UserAuthForgottenPasswordEntity extends AbstractEntity<
  UserAuthForgottenPasswordDto
> {
  @Column({ default: false })
  public used: boolean;

  @Column()
  @Exclude()
  public hashedToken: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  public updatedAt?: Date;

  @ManyToOne(
    () => UserEntity,
    (user: UserEntity) => user.userAuthForgottenPassword,
    { nullable: false },
  )
  @JoinColumn()
  public user: UserEntity;

  public dtoClass = UserAuthForgottenPasswordDto;
}
