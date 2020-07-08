import { Injectable } from '@nestjs/common';
import { BillEntity } from '../entities';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Connection,
} from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { MessageService } from 'modules/message/services';
import { UserService, UserAuthService } from 'modules/user/services';
import { LanguageService } from 'modules/language/services';
import { UserEntity } from 'modules/user/entities';
import { RoleType, Language } from 'common/constants';
import { TransactionService } from 'modules/transaction/services';
import { BillService } from 'modules/bill/services';
import { UtilsService } from 'utils/services';
import * as fs from 'fs';
import handlebars from 'handlebars';
import {
  CreateMessageTemplateDto,
  CreateMessageDto,
} from 'modules/message/dtos';
import { LanguageEntity } from 'modules/language/entities';
import { ICreatedMessage } from 'interfaces';
import { CreateTransactionDto } from 'modules/transaction/dtos';
import { MessageKeyEntity } from 'modules/message/entities';

@Injectable()
@EventSubscriber()
export class BillSubscriber implements EntitySubscriberInterface<BillEntity> {
  private readonly _developerAge = UtilsService.getAge(new Date(1997, 9, 16));
  private readonly _promotionValue = 10;
  private readonly _promotionTransferTitle = `Create an account`;
  private readonly _promotionKey = `PROMO10`;
  private readonly _messageValue = 5;
  private readonly _messageTransferTitle = `Thank you for registering! :)`;
  private readonly _messageKey = `WELCOME5`;
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
    NOTE: It need to use different services,
    that's why this subscriber is connected by the constructor.
   */
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly _messageService: MessageService,
    private readonly _userService: UserService,
    private readonly _userAuthService: UserAuthService,
    private readonly _languageService: LanguageService,
    private readonly _transactionService: TransactionService,
    private readonly _billService: BillService,
  ) {
    connection.subscribers.push(this);
  }

  public listenTo() {
    return BillEntity;
  }

  public async afterInsert(event: InsertEvent<BillEntity>): Promise<void> {
    await Promise.all([
      this._initWelcomeMessage(event.entity.user),
      this._initWelcomeTransfer(event.entity),
      this._initRegisterPromotion(event.entity),
    ]);
  }

  private async _initWelcomeTransfer(recipientBill: BillEntity): Promise<void> {
    const transaction = await this._transactionService.getTransaction({
      recipient: recipientBill.user,
      authorizationKey: this._messageKey,
    });

    if (transaction) {
      return;
    }

    const sender = await this._userAuthService.findUserAuth({
      role: RoleType.ADMIN,
    });

    if (!sender) {
      return;
    }

    const senderBill = await this._billService.getBill(sender);

    const createdTransaction = {
      amountMoney: this._messageValue,
      transferTitle: this._messageTransferTitle,
      recipientBill: recipientBill.uuid,
      senderBill: senderBill.uuid,
      locale: Language.EN,
    };

    return this._makeTransfer(createdTransaction, sender, this._messageKey);
  }

  private async _initWelcomeMessage(recipient: UserEntity): Promise<void> {
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

    return this._makeMessage(createdMessage);
  }

  private async _initRegisterPromotion(
    recipientBill: BillEntity,
  ): Promise<void> {
    const transaction = await this._transactionService.getTransaction({
      recipient: recipientBill.user,
      authorizationKey: this._promotionKey,
    });

    if (transaction) {
      return;
    }

    const sender = await this._userAuthService.findUserAuth({
      role: RoleType.ROOT,
    });

    if (!sender) {
      return;
    }

    const senderBill = await this._billService.getBill(sender);

    const createdTransaction = {
      amountMoney: this._promotionValue,
      transferTitle: this._promotionTransferTitle,
      recipientBill: recipientBill.uuid,
      senderBill: senderBill.uuid,
      locale: Language.EN,
    };

    return this._makeTransfer(createdTransaction, sender, this._promotionKey);
  }

  private _getCreatedMessage(
    key: string,
    sender: string,
    recipient: string,
    templates: CreateMessageTemplateDto[],
  ): CreateMessageDto {
    return { key, sender, recipient, templates };
  }

  private _getCompiledContent(
    content: string,
    variables: ICreatedMessage,
  ): any {
    const template = handlebars.compile(content.toString());

    return template({
      developerAge: variables.developerAge,
      customerCount: variables.customerCount,
    });
  }

  private async _createdMessageTemplates(
    languages: LanguageEntity[],
  ): Promise<CreateMessageTemplateDto[]> {
    let messageTemplates = [];
    const customerCount = await this._userService.getUsersCount();

    for (const { uuid: language, code } of languages) {
      const content = await this._getWelcomeMessageContent(code);
      const compiledContent = this._getCompiledContent(content, {
        developerAge: this._developerAge,
        customerCount,
      });
      const messageTemplate = this._createMessageTemplate(
        language,
        compiledContent,
        this._messageOptions[code].subject,
        this._messageOptions[code].actions,
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
      throw new Error(error);
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

  private async _makeTransfer(
    createdTransaction: CreateTransactionDto,
    sender: UserEntity,
    authorizationKey: string,
  ): Promise<void> {
    await this._transactionService.createTransaction(
      sender,
      createdTransaction,
      authorizationKey,
    );
    await this._transactionService.confirmTransaction(sender, {
      authorizationKey,
    });
  }

  private async _makeMessage(createdMessage: CreateMessageDto): Promise<void> {
    await this._messageService.createMessage(createdMessage);
  }
}
