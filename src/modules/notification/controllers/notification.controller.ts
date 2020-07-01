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
import { MessagesPageOptionsDto, MessagesPageDto } from 'modules/message/dtos';
import { AuthUser, Roles } from 'decorators';
import { UserEntity } from 'modules/user/entities';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import { RoleType } from 'common/constants';
import { TransactionService } from 'modules/transaction/services';
import {
  TransactionsPageDto,
  TransactionsPageOptionsDto,
} from 'modules/transaction/dtos';

@Controller('Notifications')
@ApiTags('Notifications')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
@Roles(RoleType.USER, RoleType.ADMIN)
export class NotificationController {
  constructor(private readonly _transactionService: TransactionService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Notifications are the number of new transactions received. This may be changed.',
    type: TransactionsPageDto,
  })
  async getTransactions(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TransactionsPageOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<TransactionsPageDto> {
    return this._transactionService.getTransactions(user, pageOptionsDto);
  }
}
