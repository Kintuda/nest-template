import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { ValidationError } from "./validation.error";

@Catch(ValidationError)
export class ValidationExceptionFilter
  implements ExceptionFilter<ValidationError>
{
  public catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.UNPROCESSABLE_ENTITY;

    response.status(status).reply({
      code: status,
      message: exception.message,
      details: exception.details,
    });
  }
}
