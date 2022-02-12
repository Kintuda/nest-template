import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  mixin,
  PipeTransform,
  Type,
  UnprocessableEntityException,
} from "@nestjs/common";
import { AnySchema } from "ajv";
import { ValidationError } from "./validation.error";
import { ValidationService } from "./validation.service";

export const validationPipe = (schema: AnySchema): Type<PipeTransform> => {
  @Injectable()
  class ValidationPipe implements PipeTransform {
    constructor(private readonly validationService: ValidationService) {}

    async transform(
      value: Record<string, unknown>,
      metadata: ArgumentMetadata
    ) {
      try {
        const result = this.validationService.validateAndSerialize(
          value,
          schema
        );
        return result;
      } catch (error) {
        if (error instanceof ValidationError) {
          throw new UnprocessableEntityException({
            code: HttpStatus.UNPROCESSABLE_ENTITY,
            message: error.message,
            details: error.details,
          });
        }
        throw new HttpException(
          "internal error",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  return mixin(ValidationPipe);
};
