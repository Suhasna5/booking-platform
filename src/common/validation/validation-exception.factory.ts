import { BadRequestException, ValidationError } from '@nestjs/common';
import { ValidationErrorDetail } from '../errors/error-response';

export function createValidationException(
  validationErrors: ValidationError[],
): BadRequestException {
  const errors: ValidationErrorDetail[] = validationErrors.map((error) => ({
    field: error.property,
    messages: Object.values(error.constraints ?? {}),
  }));

  return new BadRequestException({
    message: 'Validation failed',
    errors,
  });
}
