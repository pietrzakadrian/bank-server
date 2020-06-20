import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto';
import { CurrencyDto } from 'modules/currency/dto';
import { UserConfigEntity } from '../entities';

export class UserConfigDto extends AbstractDto {
  @ApiProperty()
  readonly notificationStatus: boolean;

  @ApiProperty()
  readonly notificationCount: number;

  @ApiProperty()
  readonly messageStatus: boolean;

  @ApiProperty()
  readonly messageCount: number;

  @ApiProperty({ type: CurrencyDto })
  readonly currency: CurrencyDto;

  constructor(userConfig: UserConfigEntity) {
    super(userConfig);
    this.notificationStatus = userConfig.notificationStatus;
    this.notificationCount = userConfig.notificationCount;
    this.messageStatus = userConfig.messageStatus;
    this.messageCount = userConfig.messageCount;
    this.currency = userConfig.currency.toDto();
  }
}
