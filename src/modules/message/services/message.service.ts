import { Injectable } from '@nestjs/common';
import { MessageRepository } from 'modules/message/repositories';
import { PageMetaDto } from 'common/dtos';
import { UserEntity } from 'modules/user/entities';
import { MessagesPageOptionsDto, MessagesPageDto } from 'modules/message/dtos';

@Injectable()
export class MessageService {
  constructor(private readonly _messageRepository: MessageRepository) {}

  public async getMessages(
    user: UserEntity,
    pageOptionsDto: MessagesPageOptionsDto,
  ): Promise<MessagesPageDto | undefined> {
    const queryBuilder = this._messageRepository.createQueryBuilder('messages');

    const [messages, messagesCount] = await queryBuilder
      .addSelect([
        'recipient.uuid',
        'recipient.firstName',
        'recipient.lastName',
        'recipient.avatar',
        'sender.uuid',
        'sender.firstName',
        'sender.lastName',
        'sender.avatar',
      ])
      .leftJoin('messages.recipient', 'recipient')
      .leftJoin('messages.sender', 'sender')
      .leftJoinAndSelect('messages.templates', 'templates')
      .leftJoinAndSelect('templates.language', 'language')
      .where(':userId IN ("recipient"."id", "sender"."id")')
      .orderBy('messages.createdAt', pageOptionsDto.order)
      .setParameter('userId', user.id)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: messagesCount,
    });

    return new MessagesPageDto(messages.toDtos(), pageMetaDto);
  }
}
