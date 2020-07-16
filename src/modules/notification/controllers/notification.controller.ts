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
import { UserConfigService } from 'modules/user/services';

@Controller('Notifications')
@ApiTags('Notifications')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
@Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
export class NotificationController {
  constructor(
    private readonly _transactionService: TransactionService,
    private readonly _userConfigSerivce: UserConfigService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleType.USER, RoleType.ADMIN, RoleType.ROOT)
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
    const [transactions] = await Promise.all([
      this._transactionService.getTransactions(user, pageOptionsDto),
      this._userConfigSerivce.setNotification(user.userConfig, true),
    ]);

    return transactions;
  }
}
