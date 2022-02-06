import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX_CONNECTION } from "./knex/knex.constants";
import { KnexResult } from "./knex/knex.interfaces";

@Injectable()
export class AppService {
  constructor(@Inject(KNEX_CONNECTION) private readonly connection: Knex) {}

  public heathCheck(): string {
    return "ok";
  }

  public async pingDatabase(): Promise<boolean> {
    const { rows } = await this.connection.raw<KnexResult<number>>("SELECT  1+1");
    return rows.length > 0
  }
}
