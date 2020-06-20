import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from 'modules/auth/services';
import { UserEntity } from 'modules/user/entities';
import { Observable } from 'rxjs';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = <UserEntity>request.user;

    AuthService.setAuthUser(user);

    return next.handle();
  }
}
