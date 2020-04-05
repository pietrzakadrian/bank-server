'use strict';

import { AbstractDto } from 'common/dto';
import { UtilsService } from 'providers';
import { Column, Generated, PrimaryGeneratedColumn } from 'typeorm';
export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    @Generated('uuid')
    uuid: string;

    abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

    toDto(options?: any) {
        return UtilsService.toDto(this.dtoClass, this, options);
    }
}
