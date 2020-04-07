import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dto';
import { UserRegisterDto } from 'modules/auth/dto';
import { BillService } from 'modules/bill/services';
import { UsersPageDto, UsersPageOptionsDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entities';
import { UserRepository } from 'modules/user/repositories';
import { FindConditions } from 'typeorm';

import { UserAuthService } from './user-auth.service';
import { UserConfigService } from './user-config.service';

@Injectable()
export class UserService {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _userAuthService: UserAuthService,
        private readonly _userConfigService: UserConfigService,
        private readonly _billService: BillService,
    ) {}

    public async createUser(
        userRegisterDto: UserRegisterDto,
    ): Promise<UserEntity> {
        const user = this._userRepository.create(userRegisterDto);
        await this._userRepository.save(user);

        const createdUser = { ...userRegisterDto, user };

        await Promise.all([
            this._userAuthService.createUserAuth(createdUser),
            this._userConfigService.createUserConfig(createdUser),
            this._billService.createAccountBill(createdUser),
        ]);

        return user;
    }

    public async getUser(
        findData: FindConditions<UserEntity>,
    ): Promise<UserEntity> {
        return this._userRepository.findOne(findData);
    }

    public async getUsers(
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<UsersPageDto> {
        const queryBuilder = this._userRepository.createQueryBuilder('user');
        const [users, usersCount] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount: usersCount,
        });
        return new UsersPageDto(users.toDtos(), pageMetaDto);
    }
}
