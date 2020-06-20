import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../constants';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
