import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from 'modules/user/entities';
import { UtilsService } from 'utils/services';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo() {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    event.entity.firstName = UtilsService.capitalizeName(
      event.entity.firstName,
    );
    event.entity.lastName = UtilsService.capitalizeName(event.entity.lastName);
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    if (event.entity?.lastName !== event.databaseEntity?.lastName) {
      event.entity.lastName = UtilsService.capitalizeName(
        event.entity.lastName,
      );
    }
  }
}
