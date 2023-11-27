import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';

import { User } from '../../users/models/user.entity';

interface IsEmailUniqueOptions {
  inverted: boolean;
  message?: string;
}

export function IsEmailUnique(
  options: IsEmailUniqueOptions = { inverted: false },
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      propertyName,
      target: object.constructor,
      options: validationOptions,
      constraints: [options],
      validator: CustomEmailValidation,
    });
  };
}

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class CustomEmailValidation implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
    const emailExist = await this.dataSource.getRepository(User).exist({ where: { email: value } });
    console.log('--->>> emailExist', emailExist);
    const constraint = validationArguments.constraints[0];
    const isValid = constraint.inverted ? emailExist : !emailExist;

    if (!isValid) {
      throw new ForbiddenException(constraint.message || 'Email already exist');
    }

    return isValid;
  }
}
