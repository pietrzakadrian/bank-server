'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { UserConfigEntity } from 'modules/user/entities';

export class UserConfigDto extends AbstractDto {
    @ApiProperty()
    notificationStatus: boolean;

    @ApiProperty()
    notificationCount: number;

    @ApiProperty()
    messageStatus: boolean;

    @ApiProperty()
    messageCount: number;

    constructor(userConfig: UserConfigEntity) {
        super(userConfig);
        this.notificationStatus = userConfig.notificationStatus;
        this.notificationCount = userConfig.notificationCount;
        this.messageStatus = userConfig.messageStatus;
        this.messageCount = userConfig.messageCount;
    }
}
