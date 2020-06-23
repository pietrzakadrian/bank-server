import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { UserAuthEntity } from 'modules/user/entities';
import { UtilsService } from 'utils/services';

@EventSubscriber()
export class UserAuthSubscriber
  implements EntitySubscriberInterface<UserAuthEntity> {
  listenTo() {
    return UserAuthEntity;
  }
  beforeInsert(event: InsertEvent<UserAuthEntity>) {
    if (event.entity.password) {
      event.entity.password = UtilsService.generateHash(event.entity.password);
    }
  }
  //   beforeUpdate(event: UpdateEvent<UserEntity>) {
  //     if (event.entity.password !== event.databaseEntity.password) {
  //       event.entity.password = UtilsService.generateHash(event.entity.password);
  //     }
  //   }
}
