import {
  Global,
  Module,
  DynamicModule,
  Provider,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Knex } from "knex";
import { KNEX_CONNECTION, KNEX_OPTIONS } from "./knex.constants";
import { KnexModuleAsyncOptions, KnexModuleOptions } from "./knex.interfaces";
import { KnexProvider } from "./knex.provider";

@Global()
@Module({})
export class KnexCoreModule implements OnApplicationBootstrap, OnModuleDestroy {
  constructor(private readonly moduleRef: ModuleRef) {}

  public async onModuleDestroy() {
    const connection = this.moduleRef.get<Knex>(KNEX_CONNECTION);

    if (connection && connection.destroy) {
      await connection.destroy();
    }
  }

  public async onApplicationBootstrap() {
    const connection = this.moduleRef.get<Knex>(KNEX_CONNECTION);

    if (connection) {
      await connection.raw("SELECT 1+1");
    }
  }

  static forRoot(options: KnexModuleOptions): DynamicModule {
    const knexOptionsProvider: Provider = {
      provide: KNEX_OPTIONS,
      useValue: options,
    };

    const knexConnectionProvider: Provider = {
      provide: KNEX_CONNECTION,
      useValue: KnexProvider.createKnexConnection(options),
    };

    return {
      module: KnexCoreModule,
      providers: [knexOptionsProvider, knexConnectionProvider],
      exports: [knexOptionsProvider, knexConnectionProvider],
    };
  }

  public static forRootAsync(options: KnexModuleAsyncOptions): DynamicModule {
    const knexConnectionProvider: Provider = {
      provide: KNEX_CONNECTION,
      useFactory(options: KnexModuleOptions) {
        return KnexProvider.createKnexConnection(options);
      },
      inject: [KNEX_OPTIONS],
    };

    return {
      module: KnexCoreModule,
      imports: options.imports,
      providers: [
        ...KnexProvider.createAsyncProviders(options),
        knexConnectionProvider,
      ],
      exports: [knexConnectionProvider],
    };
  }
}
