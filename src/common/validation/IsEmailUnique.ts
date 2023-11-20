import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';
import { DataSource } from 'typeorm';

import { User } from '../../users/entities/user.entity';

export function IsEmailUnique(validationOptions?: ValidatorOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      propertyName,
      target: object.constructor,
      options: validationOptions,
      validator: CustomEmailValidation,
    });
  };
}

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class CustomEmailValidation implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: string): Promise<boolean> {
    const emailExist = await this.dataSource.getRepository(User).exist({ where: { email: value } });
    if (emailExist) {
      throw new ForbiddenException('Email already exist');
    }

    return true;
  }
}
