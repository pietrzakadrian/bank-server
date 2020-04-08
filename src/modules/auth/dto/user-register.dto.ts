'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
    MinLength,
} from 'class-validator';

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
    @Length(3)
    @ApiProperty()
    readonly currencyName: string;

    @IsPhoneNumber('ZZ')
    @IsOptional()
    @ApiPropertyOptional()
    readonly phone?: string;
}
