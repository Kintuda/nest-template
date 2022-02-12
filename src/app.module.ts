import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { KnexConfig } from "./config/knex.config";
import { LoggerConfig } from "./config/logger";
import { KnexModule } from "./knex/knex.module";
import { ValidationModule } from "./validation/validation.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) =>
        new KnexConfig(config).createKnexModuleOptions(),
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) =>
        new LoggerConfig(config).createOptionsFactory(),
    }),
    ValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}