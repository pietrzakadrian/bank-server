import { UserEntity } from 'modules/user/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
