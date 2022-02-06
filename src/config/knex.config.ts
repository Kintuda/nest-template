import { ConfigService } from "@nestjs/config";
import {
  KnexModuleOptions,
  KnexModuleOptionsFactory,
} from "src/knex/knex.interfaces";
import type { Knex } from "knex";

export type ConnectionDetail = Knex.StaticConnectionConfig | string;

export class KnexConfig implements KnexModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createKnexModuleOptions():
    | KnexModuleOptions
    | Promise<KnexModuleOptions> {
    let connectionDetail: ConnectionDetail =
      this.configService.get<string>("DB_CONNECTION_URL");

    if (!connectionDetail) {
      connectionDetail = {
        database: this.configService.get<string>("DB_NAME", "app_name"),
        password: this.configService.get<string>("DB_PASSWORD", "postgres"),
        user: this.configService.get<string>("DB_USER", "postgres"),
        host: this.configService.get<string>("DB_HOST", "localhost"),
        port: this.configService.get<number>("DB_PORT", 5432),
      };
    }

    return {
      config: {
        client: "pg",
        connection: connectionDetail,
        pool: {
          min: this.configService.get<number>("DB_MIN_POOL", { infer: true }),
          max: this.configService.get<number>("DB_MAX_POOL", { infer: true }),
        },
      },
    };
  }
}
