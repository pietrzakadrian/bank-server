import { UserAuthEntity } from 'modules/user/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(UserAuthEntity)
export class UserAuthRepository extends Repository<UserAuthEntity> {}
