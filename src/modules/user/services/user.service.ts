import { Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dto';
import { UserRegisterDto } from 'modules/auth/dto';
import { BillService } from 'modules/bill/services';
import { UsersPageDto, UsersPageOptionsDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entities';
import {
    UserAuthRepository,
    UserConfigRepository,
    UserRepository,
} from 'modules/user/repositories';
import { FindConditions } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        public readonly userRepository: UserRepository,
        public readonly userAuthRepository: UserAuthRepository,
        public readonly userConfigRepository: UserConfigRepository,
        public readonly billService: BillService,
    ) {}

    findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOne(findData);
    }

    async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
        const user = this.userRepository.create(userRegisterDto);
        await this.userRepository.save(user);

        const createdUser = { ...userRegisterDto, user };
        const userAuth = this.userAuthRepository.create(createdUser);
        const userConfig = this.userConfigRepository.create(createdUser);

        await Promise.all([
            this.userAuthRepository.save(userAuth),
            this.userConfigRepository.save(userConfig),
            this.billService.createAccountBill(user),
        ]);

        return user;
    }

    async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<UsersPageDto> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
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
