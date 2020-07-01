import { AbstractEntity } from 'common/entities';
import { CurrencyEntity } from 'modules/currency/entities';
import { UserConfigDto } from 'modules/user/dtos';
import { UserEntity } from 'modules/user/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({ name: 'users_config' })
export class UserConfigEntity extends AbstractEntity<UserConfigDto> {
  /**
   * This is a @Virtual column.
   * Used only to map entity correctly using the .getManyAndCount() method.
   */
  @Column({ select: false, insert: false, update: false, nullable: true })
  readonly notificationCount: number;

  /**
   * This is a @Virtual column.
   * Used only to map entity correctly using the .getManyAndCount() method.
   */
  @Column({ select: false, insert: false, update: false, nullable: true })
  messageCount: number;

  @Column({ nullable: true })
  lastPresentLoggedDate?: Date;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.userConfig, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(
    () => CurrencyEntity,
    (currency: CurrencyEntity) => currency.userConfig,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'main_currency_id' })
  currency: CurrencyEntity;

  dtoClass = UserConfigDto;
}
