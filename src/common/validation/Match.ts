import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: NonNullable<unknown>, propertyName: string) => {
    registerDecorator({
      propertyName,
      constraints: [property],
      options: validationOptions,
      target: object.constructor,
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint()
@Injectable()
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    const relatedPropertyName = validationArguments.constraints[0];
    const relatedProperty = validationArguments.object[relatedPropertyName];

    return relatedProperty === value;
  }
}
