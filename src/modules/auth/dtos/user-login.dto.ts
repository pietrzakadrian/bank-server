import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserLoginDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly pinCode: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
