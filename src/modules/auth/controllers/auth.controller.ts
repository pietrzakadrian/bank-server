import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RoleType } from 'common/constants';
import { AuthUser, Roles } from 'decorators';
import { AuthGuard, RolesGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import {
    LoginPayloadDto,
    UserLoginDto,
    UserRegisterDto,
} from 'modules/auth/dto';
import { AuthService } from 'modules/auth/services';
import { UserDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entities';
import { UserAuthService, UserService } from 'modules/user/services';

@Controller('Auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly _userService: UserService,
        private readonly _userAuthService: UserAuthService,
        private readonly _authService: AuthService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        type: LoginPayloadDto,
        description: 'User info with access token',
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<LoginPayloadDto> {
        const user = await this._authService.validateUser(userLoginDto);
        const token = await this._authService.createToken(user);

        return new LoginPayloadDto(user.toDto(), token);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        type: UserDto,
        description: 'Successfully Registered',
    })
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
    ): Promise<UserDto> {
        const user = await this._userService.createUser(userRegisterDto);
        return user.toDto();
    }

    @Patch('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description: 'Successfully Logout',
    })
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @Roles(RoleType.USER, RoleType.ADMIN)
    async userLogout(@AuthUser() user: UserEntity): Promise<void> {
        await this._userAuthService.updateLastLogoutDate(user.userAuth);
    }
}
