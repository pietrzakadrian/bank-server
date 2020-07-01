import { MessageKeyEntity } from 'modules/message/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(MessageKeyEntity)
export class MessageKeyRepository extends Repository<MessageKeyEntity> {}
