import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  async createUser(dto: SignUpDto) {
    // const user = new User();
    // user.firstName = dto.firstName;
    // user.lastName = dto.lastName;
    // user.email = dto.email;
    // await this.userRepository.save(user);
    //
    // await this.passwordService.createPassword({
    //   // @ts-ignore
    //   password: createUserDto.password,
    //   userId: user.id,
    // });
  }

  async checkUser(dto: SignInDto) {}

  async createJWTToken(dto: SignInDto) {

  }

  async signIn(dto: SignInDto) {}
}
