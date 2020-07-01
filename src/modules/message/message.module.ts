import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRepository, MessageTemplateRepository } from './repositories';
import { MessageService } from './services/message.service';
import { MessageController } from './controllers/message.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageRepository, MessageTemplateRepository]),
  ],
  controllers: [MessageController],
  exports: [MessageService],
  providers: [MessageService],
})
export class MessageModule {}
