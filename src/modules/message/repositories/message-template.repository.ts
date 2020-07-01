import { MessageTemplateEntity } from 'modules/message/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(MessageTemplateEntity)
export class MessageTemplateRepository extends Repository<
  MessageTemplateEntity
> {}
