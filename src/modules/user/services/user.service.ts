import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dto';
import { CreateFailedException } from 'exceptions';
import { UserRegisterDto } from 'modules/auth/dto';
import { BillService } from 'modules/bill/services';
import { UsersPageDto, UsersPageOptionsDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entities';
import { UserRepository } from 'modules/user/repositories';
import { Transactional } from 'typeorm-transactional-cls-hooked';

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

    @Transactional()
    public async createUser(userRegisterDto: UserRegisterDto): Promise<any> {
        const user = this._userRepository.create(userRegisterDto);
        await this._userRepository.save(user);

        const createdUser = { ...userRegisterDto, user };

        try {
            await Promise.all([
                this._userAuthService.createUserAuth(createdUser),
                this._userConfigService.createUserConfig(createdUser),
                this._billService.createAccountBill(createdUser),
            ]);

            return this.getUser({ uuid: user.uuid });
        } catch (error) {
            throw new CreateFailedException(error);
        }
    }

    public async getUser(
        options: Partial<{ uuid: string; email: string }>,
    ): Promise<UserEntity | undefined> {
        const queryBuilder = this._userRepository.createQueryBuilder('user');

        if (options.uuid) {
            queryBuilder
                .leftJoinAndSelect('user.userAuth', 'userAuth')
                .leftJoinAndSelect('user.userConfig', 'userConfig')
                .leftJoinAndSelect('userConfig.currency', 'currency')
                .orWhere('user.uuid = :uuid', { uuid: options.uuid });
        }

        if (options.email) {
            queryBuilder.orWhere('user.email = :email', {
                email: options.email,
            });
        }

        return queryBuilder.getOne();
    }

    public async getUsers(
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<UsersPageDto> {
        const queryBuilder = this._userRepository.createQueryBuilder('user');

        const [users, usersCount] = await queryBuilder
            .leftJoinAndSelect('user.userAuth', 'userAuth')
            .leftJoinAndSelect('user.userConfig', 'userConfig')
            .leftJoinAndSelect('userConfig.currency', 'currency')
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount: usersCount,
        });

        return new UsersPageDto(users.toDtos(), pageMetaDto);
    }

    public async findUserByPinCode(pinCode: number): Promise<UserEntity> {
        const queryBuilder = this._userRepository.createQueryBuilder('user');

        queryBuilder
            .leftJoinAndSelect('user.userAuth', 'userAuth')
            .leftJoinAndSelect('user.userConfig', 'userConfig')
            .leftJoinAndSelect('userConfig.currency', 'currency')
            .where('userAuth.pinCode = :pinCode', { pinCode });

        return queryBuilder.getOne();
    }
}
