import { ApiProperty } from '@nestjs/swagger';

import { BillDto } from './bill.dto';

export class SearchBillsPayloadDto {
    @ApiProperty({
        type: BillDto,
        isArray: true,
    })
    readonly data: BillDto[];

    constructor(data: BillDto[]) {
        this.data = data;
    }
}
