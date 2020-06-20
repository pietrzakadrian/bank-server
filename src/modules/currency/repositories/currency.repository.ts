import { CurrencyEntity } from 'modules/currency/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(CurrencyEntity)
export class CurrencyRepository extends Repository<CurrencyEntity> {}
