import { ErrorObject } from "ajv";

export class ValidationError extends Error {
  constructor(
    public message: string = "validation error",
    private readonly errorDetails: ErrorObject<
      string,
      Record<string, any>,
      unknown
    >[]
  ) {
    super(message);
  }

  public get details() {
    return this.errorDetails;
  }
}
