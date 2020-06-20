import { AbstractEntity } from '../entities';

export class AbstractDto {
  readonly uuid: string;

  constructor(abstract: AbstractEntity) {
    this.uuid = abstract.uuid;
  }
}
