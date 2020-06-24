import { Request } from 'express';
import { UserLoginDto } from 'modules/auth/dtos';

export interface IUserLoginBodyRequest extends Request {
  body: UserLoginDto;
}
