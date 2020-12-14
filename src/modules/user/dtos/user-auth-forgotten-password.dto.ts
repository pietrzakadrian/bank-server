import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dtos';
import { UserAuthForgottenPasswordEntity } from '../entities';

export class UserAuthForgottenPasswordDto extends AbstractDto {
  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly used: boolean;

  constructor(userAuthForgottenPassword: UserAuthForgottenPasswordEntity) {
    super(userAuthForgottenPassword);
    this.createdAt = userAuthForgottenPassword.createdAt;
    this.used = userAuthForgottenPassword.used;
  }
}
