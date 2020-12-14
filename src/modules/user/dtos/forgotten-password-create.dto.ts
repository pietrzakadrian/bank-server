import { ApiProperty } from '@nestjs/swagger';
import { UserForgottenPasswordDto } from 'modules/auth/dtos';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from 'modules/user/entities';

export class ForgottenPasswordCreateDto extends UserForgottenPasswordDto {
  @ApiProperty({ type: () => UserEntity })
  readonly user: UserEntity;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly hashedToken: string;
}
