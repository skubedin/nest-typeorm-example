import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { comparePassword, createHash } from '../common/helpers/hash.helper';
import { Password } from './entities/password.entity';

@Injectable()
export class PasswordService {
  @InjectRepository(Password)
  private readonly passwordRepository: Repository<Password>;

  async createPassword({ userId, password }: { userId: string; password: string }) {
    const passwordEntity = new Password();
    passwordEntity.hash = await createHash(password);
    passwordEntity.user = userId;
    await this.passwordRepository.save(passwordEntity);
  }

  async comparePassword({ userId, password }: { userId: string; password: string }) {
    const passwordEntity = await this.passwordRepository.findOne({
      select: ['hash'],
      where: { id: userId },
    });

    return comparePassword(password, passwordEntity.hash);
  }
}
