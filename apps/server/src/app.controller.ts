import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("health")
  @ApiTags("health")
  @ApiOperation({ summary: "Health check", description: "Returns service status and current timestamp. Used by Render for health checks." })
  @ApiResponse({ status: 200, description: "Service is healthy", schema: { example: { status: "ok", timestamp: "2024-01-01T00:00:00.000Z" } } })
  getHealth(): { status: string; timestamp: string } {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
