import { UserAuthForgottenPasswordEntity } from '../entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(UserAuthForgottenPasswordEntity)
export class UserAuthForgottenPasswordRepository extends Repository<
  UserAuthForgottenPasswordEntity
> {}
