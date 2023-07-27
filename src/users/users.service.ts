import { Injectable } from '@nestjs/common';
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
      // @ts-ignore
      password: createUserDto.password,
      userId: user.id,
    });
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
