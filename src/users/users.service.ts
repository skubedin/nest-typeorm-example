import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { Roles } from '../common/roles/constants';
import { RoleRepository } from '../common/roles/role.repository';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
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

  findAllV2(options?: FindManyOptions<User>) {
    return this.userRepository.find({ ...options });
  }

  findOne(searchFields: FindOptionsWhere<User>): Promise<User> {
    return this.userRepository.findOne({
      select: ['id', 'firstName', 'lastName', 'email'],
      relations: ['password'],
      where: {
        ...searchFields,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
