import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'decorators';
import { AuthGuard } from 'guards';
import { AuthUserInterceptor } from 'interceptors';
import {
    LoginPayloadDto,
    UserLoginDto,
    UserRegisterDto,
} from 'modules/auth/dto';
import { AuthService } from 'modules/auth/services';
import { UserDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entities';
import { UserService } from 'modules/user/services';

import { RegisterPayloadDto } from '../dto/register-payload.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        public readonly userService: UserService,
        public readonly authService: AuthService,
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
        const user = await this.authService.validateUser(userLoginDto);
        const token = await this.authService.createToken(user);

        return new LoginPayloadDto(user.toDto(), token);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: RegisterPayloadDto,
        description: 'Successfully Registered',
    })
    async userRegister(@Body() userRegisterDto: UserRegisterDto): Promise<any> {
        const user = await this.userService.createUser(userRegisterDto);

        return user.toDto();

        // return new RegisterPayloadDto(
        //     user.toDto(),
        //     userAuth.toDto(),
        //     bill.toDto(),
        // );
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto, description: 'current user info' })
    getCurrentUser(@AuthUser() user: UserEntity) {
        return user.toDto();
    }
}
