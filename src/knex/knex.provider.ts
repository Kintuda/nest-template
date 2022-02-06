import { knex } from "knex";
import { KNEX_OPTIONS } from "./knex.constants";
import type { Provider } from "@nestjs/common";
import type {
  KnexModuleAsyncOptions,
  KnexModuleOptions,
  KnexModuleOptionsFactory,
} from "./knex.interfaces";

export class KnexProvider {
  public static createAsyncProviders(
    options: KnexModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      { provide: options.useClass, useClass: options.useClass },
    ];
  }

  public static createAsyncOptionsProvider(
    options: KnexModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: KNEX_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: KNEX_OPTIONS,
      async useFactory(
        optionsFactory: KnexModuleOptionsFactory
      ): Promise<KnexModuleOptions> {
        return optionsFactory.createKnexModuleOptions();
      },
      inject: [options.useClass || options.useExisting],
    };
  }

  public static createKnexConnection(options: KnexModuleOptions) {
    return knex(options.config);
  }
}
