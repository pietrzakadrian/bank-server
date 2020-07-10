import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsJSON,
} from 'class-validator';

export class CreateMessageTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  language: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsJSON()
  actions?: { param: string };
}
