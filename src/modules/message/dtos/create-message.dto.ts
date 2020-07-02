import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator';
import { CreateMessageTemplateDto } from './create-message-template.dto';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly sender: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly recipient: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly key: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: () => CreateMessageTemplateDto,
    isArray: true,
  })
  readonly templates: CreateMessageTemplateDto[];
}
