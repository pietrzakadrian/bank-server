import { MessageEntity } from '../entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {}
