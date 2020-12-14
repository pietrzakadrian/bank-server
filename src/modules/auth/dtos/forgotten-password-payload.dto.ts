import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { UserEntity } from 'modules/user/entities';

export class ForgottenPasswordPayloadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly token: string;

  @IsNotEmpty()
  @ApiProperty({ type: () => UserEntity })
  readonly user: UserEntity;

  constructor(token: string, user: UserEntity) {
    this.token = token;
    this.user = user;
  }
}
