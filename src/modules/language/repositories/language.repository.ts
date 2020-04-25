import { LanguageEntity } from 'modules/language/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(LanguageEntity)
export class LanguageRepository extends Repository<LanguageEntity> {}
