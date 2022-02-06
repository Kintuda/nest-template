import { ConfigService } from "@nestjs/config";
import { Params } from "nestjs-pino";

import { IncomingMessage, ServerResponse } from "http";
import { Options } from "pino-http";
import { v4 as uuid } from "uuid";
import { RequestMethod } from "@nestjs/common";

export class LoggerConfig {
  constructor(private readonly config: ConfigService) {}

  createOptionsFactory(): Params {
    return {
      exclude: [{ method: RequestMethod.ALL, path: "status" }],
      pinoHttp: {
        genReqId: (req: IncomingMessage) =>
          (req.id = req.headers["x-req-id"] || uuid()),
        level: this.config.get<string>("LOG_LEVEL", "debug"),
        customErrorMessage: (error: Error, res: ServerResponse) =>
          `request failed with message ${error.message}`,
      },
    };
  }
}
