import { AbstractEntity } from 'common/entities';
import { Entity, ManyToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { MessageTemplateDto } from '../dtos/message-template.dto';
import { MessageEntity } from './message.entity';
import { LanguageEntity } from 'modules/language/entities';

@Entity({ name: 'messages_templates' })
export class MessageTemplateEntity extends AbstractEntity<MessageTemplateDto> {
  @Column()
  subject: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  actions?: string;

  @ManyToOne(
    () => MessageEntity,
    (message: MessageEntity) => message.templates,
    { nullable: false, onDelete: 'CASCADE' },
  )
  message: MessageEntity;

  @ManyToOne(
    () => LanguageEntity,
    (language: LanguageEntity) => language.template,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  language: LanguageEntity;

  dtoClass = MessageTemplateDto;
}
