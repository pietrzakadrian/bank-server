import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMessageTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly language: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly subject: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly content: string;

  @IsOptional()
  @ApiPropertyOptional()
  readonly actions?: string;
}
