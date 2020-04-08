'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto';
import { UserConfigEntity } from 'modules/user/entities';

export class UserConfigDto extends AbstractDto {
    @ApiProperty()
    readonly notificationStatus: boolean;

    @ApiProperty()
    readonly notificationCount: number;

    @ApiProperty()
    readonly messageStatus: boolean;

    @ApiProperty()
    readonly messageCount: number;

    constructor(userConfig: UserConfigEntity) {
        super(userConfig);
        this.notificationStatus = userConfig.notificationStatus;
        this.notificationCount = userConfig.notificationCount;
        this.messageStatus = userConfig.messageStatus;
        this.messageCount = userConfig.messageCount;
    }
}
