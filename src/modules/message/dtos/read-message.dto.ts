import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ReadMessageDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly uuid?: string;
}
