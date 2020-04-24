import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from 'common/dto';

import { CurrencyDto } from './currency.dto';

export class CurrenciesPageDto {
    @ApiProperty({
        type: CurrencyDto,
        isArray: true,
    })
    readonly data: CurrencyDto[];

    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: CurrencyDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
