'use strict';

import { AbstractEntity } from 'common/entities';

export class AbstractDto {
    uuid: string;

    constructor(abstractEntity: AbstractEntity) {
        this.uuid = abstractEntity.uuid;
    }
}
