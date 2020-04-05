import { BillEntity } from 'modules/bill/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(BillEntity)
export class BillRepository extends Repository<BillEntity> {}
