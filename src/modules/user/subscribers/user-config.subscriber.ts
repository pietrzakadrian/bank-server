import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { UserConfigEntity } from 'modules/user/entities';
import { ModuleRef } from '@nestjs/core';

@EventSubscriber()
export class UserConfigSubscriber
  implements EntitySubscriberInterface<UserConfigEntity> {
  private readonly _moduleOptions = { strict: false };

  constructor(private readonly _moduleRef: ModuleRef) {}

  listenTo() {
    return UserConfigEntity;
  }

  beforeInsert(event: InsertEvent<UserConfigEntity>): void {
    if (event.entity.user) {
      console.log('test', event.entity);
    }
  }
}
