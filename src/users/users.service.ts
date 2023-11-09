import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  constructor(private readonly passwordService: PasswordService) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    await this.userRepository.save(user);

    await this.passwordService.createPassword({
      password: createUserDto.password,
      user: user,
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
