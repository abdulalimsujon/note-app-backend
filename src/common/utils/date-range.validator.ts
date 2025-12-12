import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateRangeValidator', async: false })
export class DateRangeValidator implements ValidatorConstraintInterface {
  validate(lastDate: any, args: ValidationArguments) {
    const obj: any = args.object;

    if (!obj.startDate || !lastDate) return true;

    const start = new Date(obj.startDate).getTime();
    const last = new Date(lastDate).getTime();

    return last >= start;
  }

  defaultMessage(args: ValidationArguments) {
    return 'lastDate must be greater than or equal to startDate';
  }
}
