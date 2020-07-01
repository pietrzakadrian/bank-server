import { AbstractEntity } from 'common/entities';
import { UserEntity } from 'modules/user/entities';
import {
  Column,
  Entity,
  UpdateDateColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MessageDto } from 'modules/message/dtos';
import { MessageTemplateEntity } from 'modules/message/entities';

@Entity({ name: 'messages' })
export class MessageEntity extends AbstractEntity<MessageDto> {
  @Column({ default: false })
  readed: boolean;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.sender, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.recipient, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  recipient: UserEntity;

  @OneToMany(
    () => MessageTemplateEntity,
    (templates: MessageTemplateEntity) => templates.message,
    { nullable: false },
  )
  templates: MessageTemplateEntity[];

  dtoClass = MessageDto;
}
