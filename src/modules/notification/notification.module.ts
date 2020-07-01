import { Module } from '@nestjs/common';

import { TransactionModule } from 'modules/transaction/transaction.module';
import { NotificationController } from './controllers/notification.controller';

@Module({
  imports: [TransactionModule],
  controllers: [NotificationController],
  exports: [],
  providers: [],
})
export class NotificationModule {}
