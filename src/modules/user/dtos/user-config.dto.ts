import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dtos';
import { CurrencyDto } from 'modules/currency/dtos';
import { UserConfigEntity } from 'modules/user/entities';
import { Type } from 'class-transformer';

export class UserConfigDto extends AbstractDto {
  @ApiProperty()
  readonly notificationCount: number;

  @Type(() => Number)
  @ApiProperty()
  readonly messageCount: number;

  @ApiProperty({ type: () => CurrencyDto })
  readonly currency: CurrencyDto;

  constructor(userConfig: UserConfigEntity) {
    super(userConfig);
    this.notificationCount = userConfig.notificationCount;
    this.messageCount = userConfig.messageCount;
    this.currency = userConfig.currency.toDto();
  }
}
