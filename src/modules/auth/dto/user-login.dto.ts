'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UserLoginDto {
    @IsNumber()
    @ApiProperty()
    readonly pinCode: number;

    @IsString()
    @ApiProperty()
    readonly password: string;
}
