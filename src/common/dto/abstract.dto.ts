'use strict';

import { AbstractEntity } from 'common/entities';

export class AbstractDto {
    readonly uuid: string;

    constructor(abstract: AbstractEntity) {
        this.uuid = abstract.uuid;
    }
}
