import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MessageRepository,
  MessageTemplateRepository,
  MessageKeyRepository,
} from './repositories';
import { MessageService } from './services/message.service';
import { MessageController } from './controllers/message.controller';
import { MessageKeyService } from './services/message-key.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      MessageTemplateRepository,
      MessageKeyRepository,
    ]),
  ],
  controllers: [MessageController],
  exports: [MessageService, MessageKeyService],
  providers: [MessageService, MessageKeyService],
})
export class MessageModule {}
