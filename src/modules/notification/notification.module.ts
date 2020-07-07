import { Module } from '@nestjs/common';

import { TransactionModule } from 'modules/transaction/transaction.module';
import { NotificationController } from './controllers/notification.controller';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [TransactionModule, UserModule],
  controllers: [NotificationController],
  exports: [],
  providers: [],
})
export class NotificationModule {}
