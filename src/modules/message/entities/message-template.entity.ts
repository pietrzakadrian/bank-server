import { AbstractEntity } from 'common/entities';
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { MessageTemplateDto } from 'modules/message/dtos';
import { MessageEntity } from 'modules/message/entities';
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
