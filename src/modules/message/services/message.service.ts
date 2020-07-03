import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { MessageRepository } from 'modules/message/repositories';
import { PageMetaDto } from 'common/dtos';
import { UserEntity } from 'modules/user/entities';
import { MessagesPageOptionsDto, MessagesPageDto } from 'modules/message/dtos';
import { CreateMessageDto } from '../dtos';
import { UserService } from 'modules/user/services';
import {
  MessageKeyService,
  MessageTemplateService,
} from 'modules/message/services';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { MessageEntity } from '../entities';

@Injectable()
export class MessageService {
  constructor(
    private readonly _messageRepository: MessageRepository,
    @Inject(forwardRef(() => MessageKeyService))
    private readonly _messageKeyService: MessageKeyService,
    @Inject(forwardRef(() => MessageTemplateService))
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
      .leftJoinAndSelect('messages.key', 'key')
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

  public async getMessageByMessageKey(
    options: Partial<{
      uuid: string;
      name: string;
      user: UserEntity;
    }>,
  ): Promise<MessageEntity | undefined> {
    const queryBuilder = this._messageRepository.createQueryBuilder('messages');

    queryBuilder
      .leftJoinAndSelect('messages.key', 'key')
      .leftJoinAndSelect('messages.recipient', 'recipient');

    if (options.uuid) {
      queryBuilder.orWhere('key.uuid = :uuid', { uuid: options.uuid });
    }

    if (options.name) {
      queryBuilder.orWhere('key.name = :name', { name: options.name });
    }

    if (options.user) {
      queryBuilder.andWhere('recipient.id = :user', {
        user: options.user.id,
      });
    }

    return queryBuilder.getOne();
  }

  @Transactional()
  public async createMessage(
    createMessageDto: CreateMessageDto,
  ): Promise<MessageEntity | any> {
    const [recipient, sender, key] = await Promise.all([
      this._userService.getUser({ uuid: createMessageDto.recipient }),
      this._userService.getUser({ uuid: createMessageDto.sender }),
      this._messageKeyService.getMessageKey(createMessageDto.key),
    ]);

    const message = this._messageRepository.create({ recipient, sender, key });
    await this._messageRepository.save(message);

    const createdMessage = { message, ...createMessageDto };

    const templates = await this._messageTemplateService.createMessageTemplate(
      createdMessage,
    );

    return { ...message, templates: templates.toDtos() };
  }
}
