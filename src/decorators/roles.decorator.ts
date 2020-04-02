import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'common/constants';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
