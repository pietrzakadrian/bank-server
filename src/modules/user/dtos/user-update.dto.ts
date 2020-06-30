import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  readonly lastName?: string;

  @IsString()
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  readonly currency?: string;

  @IsString()
  @ApiProperty()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  @IsOptional()
  readonly password?: string;
}
