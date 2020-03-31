import 'source-map-support/register';

import * as _ from 'lodash';

import { AbstractDto } from './common/dto/abstract.dto';
import { AbstractEntity } from './common/entities/abstract.entity';

declare global {
    // tslint:disable-next-line:naming-convention no-unused
    interface Array<T> {
        toDtos<B extends AbstractDto>(this: AbstractEntity<B>[]): B[];
    }
}

Array.prototype.toDtos = function <B extends AbstractDto>(options?: any): B[] {
    // tslint:disable-next-line:no-invalid-this
    return <B[]>_(this)
        .map((item) => item.toDto(options))
        .compact()
        .value();
};
