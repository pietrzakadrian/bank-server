import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'modules/user/dtos';

import { TokenPayloadDto } from './token-payload.dto';

export class LoginPayloadDto {
  @ApiProperty({ type: UserDto })
  readonly user: UserDto;

  @ApiProperty({ type: TokenPayloadDto })
  readonly token: TokenPayloadDto;

  constructor(user: UserDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
