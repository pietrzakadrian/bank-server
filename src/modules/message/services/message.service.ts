import { Injectable } from '@nestjs/common';
import { MessageRepository } from 'modules/message/repositories';
import { PageMetaDto } from 'common/dtos';
import { UserEntity } from 'modules/user/entities';
import { MessagesPageOptionsDto, MessagesPageDto } from 'modules/message/dtos';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { UserService } from 'modules/user/services';
import {
  MessageKeyService,
  MessageTemplateService,
} from 'modules/message/services';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class MessageService {
  constructor(
    private readonly _messageRepository: MessageRepository,
    private readonly _messageKeyService: MessageKeyService,
    private readonly _messageTemplateService: MessageTemplateService,
    private readonly _userService: UserService,
  ) {}

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

  @Transactional()
  public async createMessage(createMessageDto: CreateMessageDto): Promise<any> {
    const [recipient, sender, key] = await Promise.all([
      this._userService.getUser({ uuid: createMessageDto.recipient }),
      this._userService.getUser({ uuid: createMessageDto.sender }),
      this._messageKeyService.getMessageKey(createMessageDto.key),
    ]);

    const message = this._messageRepository.create({ recipient, sender, key });
    await this._messageRepository.save(message);

    const createdMessage = { message, ...createMessageDto };
    const messageTemplate = await this._messageTemplateService.createMessageTemplate(
      createdMessage,
    );

    return {
      message: {
        ...message,
        messageTemplate,
      },
    };
  }
}
