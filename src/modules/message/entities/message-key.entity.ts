import { AbstractEntity } from 'common/entities';
import { Entity, Column, OneToMany } from 'typeorm';
import { MessageEntity } from 'modules/message/entities';
import { MessageKeyDto } from 'modules/message/dtos';

@Entity({ name: 'messages_keys' })
export class MessageKeyEntity extends AbstractEntity<MessageKeyDto> {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => MessageEntity, (message: MessageEntity) => message.key, {
    nullable: false,
  })
  message: MessageEntity[];

  dtoClass = MessageKeyDto;
}
