import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from 'common/dtos';
import { MessageKeyEntity } from '../entities/message-key.entity';

export class MessageKeyDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  constructor(key: MessageKeyEntity) {
    super(key);
    this.name = key.name;
  }
}
