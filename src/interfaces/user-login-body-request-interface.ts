import { Request } from 'express';
import { UserLoginDto } from 'modules/auth/dto';

export interface IUserLoginBodyRequest extends Request {
    body: UserLoginDto;
}
