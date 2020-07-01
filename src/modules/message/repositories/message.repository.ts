import { MessageEntity } from 'modules/message/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {}
