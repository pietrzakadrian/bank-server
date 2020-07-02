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
} from '@nestjs/common';
import handlebars from 'handlebars';
import { MessageService } from 'modules/message/services';
import { MessagesPageOptionsDto, MessagesPageDto } from 'modules/message/dtos';
import { AuthUser, Roles } from 'decorators';
import { UserEntity } from 'modules/user/entities';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import { RoleType } from 'common/constants';
import { CreateMessageDto } from '../dtos/create-message.dto';

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
  @Roles(RoleType.USER, RoleType.ADMIN)
  async getMessages(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: MessagesPageOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<MessagesPageDto | undefined | any> {
    const messages = await this._messageService.getMessages(
      user,
      pageOptionsDto,
    );

    messages.data.map((data) =>
      data.templates.map((template) => {
        const temp = handlebars.compile(template.content, {
          strict: true,
        });

        const result = temp({
          developerAge: 22,
          customerCount: 1500,
        });

        template.content = result;
      }),
    );

    return messages;
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create Message',
  })
  @Roles(RoleType.USER, RoleType.ADMIN)
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<any> {
    return this._messageService.createMessage(createMessageDto);
  }
}
