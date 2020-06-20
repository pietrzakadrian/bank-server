'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dtos';
import { LanguageEntity } from 'modules/language/entities';

export class LanguageDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly code: string;

  constructor(language: LanguageEntity) {
    super(language);
    this.name = language.name;
    this.code = language.code;
  }
}
