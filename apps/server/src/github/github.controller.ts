import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { GithubService } from "./github.service";

@ApiTags("github")
@Controller("github")
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get("app-id")
  @ApiOperation({ summary: "Get GitHub App ID", description: "Returns the configured GitHub App ID." })
  @ApiResponse({ status: 200, description: "GitHub App ID", schema: { example: 123456 } })
  getGithubAppId(): number | undefined {
    return this.githubService.getGithubAppId();
  }
}
