'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly lastName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    readonly email: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({ minLength: 6 })
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly currency: string;
}
