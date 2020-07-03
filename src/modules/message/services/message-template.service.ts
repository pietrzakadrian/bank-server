import { Injectable } from '@nestjs/common';
import { MessageTemplateRepository } from '../repositories';
import { InsertResult } from 'typeorm';
import { MessageEntity, MessageTemplateEntity } from '../entities';
import { LanguageEntity } from 'modules/language/entities';
import { LanguageService } from 'modules/language/services';
import { MessageTemplateDto } from '../dtos';

@Injectable()
export class MessageTemplateService {
  constructor(
    private readonly _messageTemplateRepository: MessageTemplateRepository,
    private readonly _languageService: LanguageService,
  ) {}

  public async createMessageTemplate(
    createdMessage,
  ): Promise<MessageTemplateEntity[] | any> {
    let templates = [];

    for (const {
      subject,
      content,
      actions,
      language,
    } of createdMessage.templates) {
      const languageEntity = await this._languageService.getLanguage(language);

      const messageTemplate = await this._setMessageTemplate(
        subject,
        content,
        createdMessage.message,
        languageEntity,
        actions,
      );

      templates = [...templates, messageTemplate];
    }

    return templates;
  }

  private async _setMessageTemplate(
    subject: string,
    content: string,
    message: MessageEntity,
    language: LanguageEntity,
    actions?: string,
  ): Promise<MessageTemplateEntity> {
    const messageTemplate = this._messageTemplateRepository.create({
      subject,
      content,
      message,
      language,
      actions,
    });

    return this._messageTemplateRepository.save(messageTemplate);
  }
}
