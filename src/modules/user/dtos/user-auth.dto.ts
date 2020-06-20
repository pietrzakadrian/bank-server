import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos';
import { UserAuthEntity } from '../entities';

export class UserAuthDto extends AbstractDto {
  @ApiProperty()
  readonly pinCode: number;

  @ApiProperty()
  readonly lastSuccessfulLoggedDate: Date;

  @ApiProperty()
  readonly lastFailedLoggedDate: Date;

  @ApiProperty()
  readonly lastLogoutDate: Date;

  constructor(userAuth: UserAuthEntity) {
    super(userAuth);
    this.pinCode = userAuth.pinCode;
    this.lastSuccessfulLoggedDate = userAuth.lastSuccessfulLoggedDate;
    this.lastFailedLoggedDate = userAuth.lastFailedLoggedDate;
    this.lastLogoutDate = userAuth.lastLogoutDate;
  }
}
