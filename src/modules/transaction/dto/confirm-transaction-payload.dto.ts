'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmTransactionPayloadDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly authorizationKey: string;
}
