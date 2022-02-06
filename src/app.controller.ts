import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

export interface ComponentsHeathCheck {
  database: boolean;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(["", "status"])
  public heathCheck(): string {
    return this.appService.heathCheck();
  }

  @Get("status/components")
  public async pingConnection(): Promise<ComponentsHeathCheck> {
    const dbUp = await this.appService.pingDatabase();

    return {
      database: dbUp,
    };
  }
}
