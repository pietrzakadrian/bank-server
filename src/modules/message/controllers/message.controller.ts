import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { MessagesPageOptionsDto, MessagesPageDto } from '../dtos';
import { AuthUser } from 'decorators';
import { UserEntity } from 'modules/user/entities';
import { AuthGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';

@Controller('Messages')
@ApiTags('Messages')
@UseGuards(AuthGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class MessageController {
  constructor(private readonly _messageService: MessageService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get User's messages",
    type: MessagesPageDto,
  })
  async getMessages(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: MessagesPageOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<MessagesPageDto | undefined> {
    return this._messageService.getMessages(user, pageOptionsDto);
  }
}
