import { Injectable, NestMiddleware } from '@nestjs/common';
import { RoleType } from 'common/constants';
import { NextFunction, Response } from 'express';
import { IUserLoginBodyRequest } from 'interfaces';
import { BillService } from 'modules/bill/services';
import { TransactionService } from 'modules/transaction/services';
import { UserAuthService, UserService } from 'modules/user/services';
import { Language } from 'common/constants/language.constant';
import { UtilsService } from 'utils/services';
import { MessageService } from 'modules/message/services';
import { LanguageService } from 'modules/language/services';
import {
  CreateMessageTemplateDto,
  CreateMessageDto,
} from 'modules/message/dtos';
import * as fs from 'fs';
import handlebars from 'handlebars';

@Injectable()
export class WelcomePromotionMiddleware implements NestMiddleware {
  private readonly _developerAge = UtilsService.getAge(new Date(1997, 9, 16));
  private readonly _promotionValue = 5;
  private readonly _promotionTransferTitle = `Thank you for registering! :)`;
  private readonly _promotionKey = `WELCOME5`;
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

  constructor(
    private readonly _billService: BillService,
    private readonly _transactionService: TransactionService,
    private readonly _userService: UserService,
    private readonly _userAuthService: UserAuthService,
    private readonly _messageService: MessageService,
    private readonly _languageService: LanguageService,
  ) {}

  public async use(
    req: IUserLoginBodyRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await Promise.all([
      this._initWelcomeTransfer(req.body.pinCode),
      this._initWelcomeMessage(req.body.pinCode),
    ]);

    next();
  }

  private async _initWelcomeTransfer(pinCode: number) {
    const [recipient, sender] = await Promise.all([
      this._userAuthService.findUserAuth({ pinCode }),
      this._userAuthService.findUserAuth({ role: RoleType.ADMIN }),
    ]);

    if (!recipient || !sender) {
      return;
    }

    const transaction = await this._transactionService.getTransaction({
      recipient,
      authorizationKey: this._promotionKey,
    });

    if (transaction) {
      return;
    }

    const [senderBill, recipientBill] = await Promise.all([
      this._billService.getBill(sender),
      this._billService.getBill(recipient),
    ]);

    const createdTransaction = {
      amountMoney: this._promotionValue,
      transferTitle: this._promotionTransferTitle,
      recipientBill: recipientBill.uuid,
      senderBill: senderBill.uuid,
      locale: Language.EN,
    };

    await this._transactionService.createTransaction(
      sender,
      createdTransaction,
      this._promotionKey,
    );
    await this._transactionService.confirmTransaction(sender, {
      authorizationKey: this._promotionKey,
    });
  }

  private async _initWelcomeMessage(pinCode: number) {
    const recipient = await this._userAuthService.findUserAuth({ pinCode });

    if (!recipient) {
      return;
    }

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

    await this._messageService.createMessage(createdMessage);
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
        __dirname +
          `/../modules/message/templates/welcome.template.${locale}.hbs`,
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
}
