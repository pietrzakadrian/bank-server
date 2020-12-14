import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';

export class UserForgottenPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly emailAddress: string;

  @Length(2)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly locale: string;
}
