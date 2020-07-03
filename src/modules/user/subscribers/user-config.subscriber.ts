import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Connection,
} from 'typeorm';
import { UserConfigEntity, UserEntity } from 'modules/user/entities';
import { MessageService } from 'modules/message/services';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as fs from 'fs';
import handlebars from 'handlebars';
import { RoleType } from 'common/constants';
import { UtilsService } from 'utils/services';
import { UserService, UserAuthService } from 'modules/user/services';
import { LanguageService } from 'modules/language/services';
import { CreateMessageDto } from 'modules/message/dtos/create-message.dto';
import { CreateMessageTemplateDto } from 'modules/message/dtos/create-message-template.dto';

@Injectable()
@EventSubscriber()
export class UserConfigSubscriber
  implements EntitySubscriberInterface<UserConfigEntity> {
  private readonly _developerAge = UtilsService.getAge(new Date(1997, 9, 16));
  private readonly _messageName = 'WELCOME_MESSAGE';
  private readonly _messageOptions = {
    en: {
      subject: 'Cooperation proposal',
      actions: 'Ok, I will send you my opinion',
    },
    de: {
      subject: 'Kooperationsvorschlag',
      actions: 'Ok, ich sende dir meine Meinung',
    },
    pl: {
      subject: 'Propozycja współpracy',
      actions: 'Ok, wyślę Tobie moją opinię',
    },
  };

  /*
    NOTE: It need to use different dependencies,
    that's why this subscriber is connected by the constructor.
   */
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly _messageService: MessageService,
    private readonly _userService: UserService,
    private readonly _userAuthService: UserAuthService,
    private readonly _languageService: LanguageService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return UserConfigEntity;
  }

  async afterInsert(event: InsertEvent<UserConfigEntity>): Promise<void> {
    if (event.entity.user) {
      await this._initWelcomeMessage(event.entity.user);
    }
  }

  private async _initWelcomeMessage(recipient): Promise<void> {
    await this._createWelcomeMessage(recipient);
  }

  private async _createWelcomeMessage(recipient: UserEntity): Promise<any> {
    const message = await this._messageService.getMessageByMessageKey({
      user: recipient,
      name: this._messageName,
    });

    if (message) {
      return;
    }

    const { key } = await this._messageService.getMessageByMessageKey({
      name: this._messageName,
    });
    const languages = await this._languageService.getLanguages();
    const sender = await this._userAuthService.findUserAuth({
      role: RoleType.ADMIN,
    });
    const templates = await this._createdMessageTemplates(languages);

    const createdMessage = this._getCreatedMessage(
      key.uuid,
      sender.uuid,
      recipient.uuid,
      templates,
    );

    const response = await this._messageService.createMessage(createdMessage);
    console.log('response', response);
  }

  private _getCreatedMessage(
    key: string,
    sender: string,
    recipient: string,
    templates: CreateMessageTemplateDto[],
  ): CreateMessageDto {
    return { key, sender, recipient, templates };
  }

  private _getCompiledContent(content, variables) {
    const template = handlebars.compile(content.toString());

    return template({
      developerAge: variables.developerAge,
      customerCount: variables.customerCount,
    });
  }

  private async _createdMessageTemplates(
    languages,
  ): Promise<CreateMessageTemplateDto[]> {
    let messageTemplates = [];
    const customerCount = await this._userService.getUsersCount();

    for (const { uuid: language, code } of languages) {
      const content = await this._getWelcomeMessageContent(code.toLowerCase());
      const compiledContent = this._getCompiledContent(content, {
        developerAge: this._developerAge,
        customerCount,
      });
      const messageTemplate = this._createMessageTemplate(
        language,
        compiledContent,
        this._messageOptions[code.toLowerCase()].subject,
        this._messageOptions[code.toLowerCase()].actions,
      );

      messageTemplates = [...messageTemplates, messageTemplate];
    }

    return messageTemplates;
  }

  private async _getWelcomeMessageContent(locale: string): Promise<string> {
    try {
      const data = await fs.promises.readFile(
        __dirname + `/../../message/templates/welcome.template.${locale}.hbs`,
        'utf8',
      );
      return data;
    } catch (error) {
      throw new Error('error');
    }
  }

  private _createMessageTemplate(
    language: string,
    content: string,
    subject: string,
    actions?: string,
  ): CreateMessageTemplateDto {
    return { language, content, subject, actions };
  }
}
