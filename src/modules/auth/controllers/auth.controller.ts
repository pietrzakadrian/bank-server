import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    LoginPayloadDto,
    UserLoginDto,
    UserRegisterDto,
} from 'modules/auth/dto';
import { AuthService } from 'modules/auth/services';
import { UserDto } from 'modules/user/dto';
import { UserService } from 'modules/user/services';

@Controller('Auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly _userService: UserService,
        private readonly _authService: AuthService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'User info with access token',
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<LoginPayloadDto> {
        const user = await this._authService.validateUser(userLoginDto);
        const token = await this._authService.createToken(user);

        return new LoginPayloadDto(token);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: UserDto,
        description: 'Successfully Registered',
    })
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
    ): Promise<UserDto> {
        const user = await this._userService.createUser(userRegisterDto);

        return user.toDto();
    }
}
