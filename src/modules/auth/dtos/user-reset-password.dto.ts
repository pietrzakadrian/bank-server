import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minLength: 6 })
  readonly password: string;
}
