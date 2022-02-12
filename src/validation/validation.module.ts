import { DynamicModule, Module, Provider } from "@nestjs/common";
import Ajv from "ajv";
import ajvFormats from "ajv-formats";
import { VALIDATION_INSTANCE } from "./validation.constant";
import { ValidationService } from "./validation.service";

@Module({
  providers: [ValidationService],
  exports: [ValidationService],
})
export class ValidationModule {
  public static forRoot(): DynamicModule {
    const ajv = new Ajv({ 
      removeAdditional: true,
      useDefaults: true,
      coerceTypes: true,
      allErrors: true,
    });
    const patchedAjv = ajvFormats(ajv, {});
    const validatorProvider: Provider = {
      provide: VALIDATION_INSTANCE,
      useValue: patchedAjv,
    };

    return {
      module: ValidationModule,
      global: true,
      imports: [],
      exports: [validatorProvider],
      providers: [validatorProvider],
    };
  }
}