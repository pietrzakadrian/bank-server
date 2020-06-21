'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBillDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly currency: string;
}
