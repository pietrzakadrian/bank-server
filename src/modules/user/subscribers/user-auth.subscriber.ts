import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserAuthEntity } from 'modules/user/entities';
import { UtilsService } from 'utils/services';

@EventSubscriber()
export class UserAuthSubscriber
  implements EntitySubscriberInterface<UserAuthEntity> {
  listenTo() {
    return UserAuthEntity;
  }

  beforeInsert(event: InsertEvent<UserAuthEntity>): void {
    if (event.entity.password) {
      event.entity.password = UtilsService.generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<UserAuthEntity>): void {
    if (event.entity?.password !== event.databaseEntity?.password) {
      event.entity.password = UtilsService.generateHash(event.entity.password);
    }
  }
}
