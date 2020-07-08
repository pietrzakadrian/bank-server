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
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { MessageService } from 'modules/message/services';
import {
  MessagesPageOptionsDto,
  MessagesPageDto,
  MessageDto,
  ReadMessageDto,
  CreateMessageDto,
} from 'modules/message/dtos';
import { AuthUser, Roles } from 'decorators';
import { UserEntity } from 'modules/user/entities';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import { RoleType } from 'common/constants';

@Controller('Messages')
@ApiTags('Messages')
@UseGuards(AuthGuard, RolesGuard)
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
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  async getMessages(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: MessagesPageOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<MessagesPageDto | undefined | any> {
    return this._messageService.getMessages(user, pageOptionsDto);
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create Message',
    type: MessageDto,
  })
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageDto | any> {
    return this._messageService.createMessage(createMessageDto);
  }

  @Patch('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Readed message',
    type: MessageDto,
  })
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
  async readMessage(
    @AuthUser() user: UserEntity,
    @Body() readMessageDto: ReadMessageDto,
  ): Promise<MessageDto | any> {
    return this._messageService.readMessages(user, readMessageDto);
  }
}
