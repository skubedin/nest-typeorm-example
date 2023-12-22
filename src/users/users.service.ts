import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  IsNull,
  Like,
  Not,
} from 'typeorm';

import { Roles } from '../common/roles/constants';
import { RoleRepository } from '../common/roles/role.repository';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const roleId = await this.roleRepository.getIdByName(Roles.USER);
    const userRecord = await this.userRepository.create({ ...user, role: { id: roleId } });

    await this.passwordService.createPassword({
      password,
      userId: userRecord.identifiers[0].id,
    });
  }

  async changePassword(id: string, newPassword: string, oldPassword: string) {
    const user = await this.userRepository.findOneBy({ id });
    const isValidOldPassword = await this.passwordService.comparePassword({
      userId: id,
      password: oldPassword,
    });

    if (!isValidOldPassword) throw new UnprocessableEntityException();

    return await this.passwordService.changePassword(user.id, newPassword);
  }

  findAllV1(options?: FindManyOptions<User>) {
    return this.userRepository.find({ ...options });
  }

  findAllV2(query?: GetUsersQueryDto) {
    const page = query?.page ?? 1;
    const perPage = query?.perPage ?? 25;
    const skip = perPage * page - perPage;
    const search = query?.search ? `%${query.search}%` : '';
    const where = [];

    if (search) {
      where.push(
        {
          firstName: ILike(search),
        },
        {
          lastName: ILike(search),
        },
        {
          email: ILike(search),
        },
      );
    }

    return this.userRepository.find({
      where,
      skip,
      take: perPage,
    });
  }

  findOne(searchFields: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne({
      select: ['id', 'firstName', 'lastName', 'email'],
      relations: ['password'],
      ...searchFields,
      where: {
        ...searchFields.where,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async setPassword(dto: SetPasswordDto) {
    const user = await this.userRepository.findOne({
      relations: {
        password: true,
      },
      select: {
        id: true,
        email: true,
        password: {
          id: true,
          hash: true,
        },
      },
      where: { email: dto.email, password: { deletedAt: IsNull() } },
    });

    if (!user || user.password.length > 0) throw new ForbiddenException();

    await this.passwordService.createPassword({ userId: user.id, password: dto.password });
  }
}
