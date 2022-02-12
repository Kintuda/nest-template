import { DynamicModule, Module } from "@nestjs/common";
import { KnexCoreModule } from "./knex-core.module";
import { KnexModuleAsyncOptions, KnexModuleOptions } from "./knex.interfaces";

@Module({})
export class KnexModule {
  static forRoot(options: KnexModuleOptions): DynamicModule {
    return {
      module: KnexModule,
      imports: [KnexCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: KnexModuleAsyncOptions): DynamicModule {
    return {
      module: KnexModule,
      imports: [KnexCoreModule.forRootAsync(options)],
    };
  }
}
