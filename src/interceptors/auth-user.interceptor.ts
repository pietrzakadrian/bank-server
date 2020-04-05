import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { AuthService } from 'modules/auth/services';
import { UserAuthEntity } from 'modules/user/entities';
import { Observable } from 'rxjs';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        const userAuth = <UserAuthEntity>request.user;
        AuthService.setAuthUser(userAuth);

        return next.handle();
    }
}
