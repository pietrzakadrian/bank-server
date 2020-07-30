import { Module } from '@nestjs/common';

import { TransactionModule } from 'modules/transaction';
import { NotificationController } from './controllers/notification.controller';
import { UserModule } from 'modules/user';

@Module({
  imports: [TransactionModule, UserModule],
  controllers: [NotificationController],
  exports: [],
  providers: [],
})
export class NotificationModule {}
