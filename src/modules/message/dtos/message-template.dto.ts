import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from 'common/dtos';
import { MessageTemplateEntity } from 'modules/message/entities';
import { IsOptional, IsArray } from 'class-validator';
import { LanguageDto } from 'modules/language/dtos';

export class MessageTemplateDto extends AbstractDto {
  @ApiProperty()
  readonly subject: string;

  @ApiProperty()
  readonly content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  readonly actions?: string[];

  @ApiProperty({ type: () => LanguageDto })
  readonly language: LanguageDto;

  constructor(template: MessageTemplateEntity) {
    super(template);
    this.subject = template.subject;
    this.content = template.content;
    this.actions = template?.actions;
    this.language = template.language.toDto();
  }
}
