import { Inject, Injectable } from "@nestjs/common";
import Ajv, { AnySchema } from "ajv";
import { VALIDATION_INSTANCE } from "./validation.constant";
import { ValidationError } from "./validation.error";

@Injectable()
export class ValidationService {
  constructor(@Inject(VALIDATION_INSTANCE) private readonly validator: Ajv) {}

  public validateAndSerialize<T>(
    data: Record<string, unknown>,
    schema: AnySchema
  ): T {
    const validator = this.validator.compile<T>(schema);
    const serialized = validator(data);

    if (!serialized && validator.errors) {
      throw new ValidationError("validation error", validator.errors);
    }

    return data as T;
  }
}
