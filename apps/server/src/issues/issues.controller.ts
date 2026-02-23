import { Controller, Get, Query, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from "@nestjs/swagger";
import { IssuesService } from "./issues.service";
import { Issue } from "./entities/issue.entity";

@ApiTags("issues")
@Controller("issues")
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  @ApiOperation({ summary: "List all good first issues", description: "Returns all seeded issues, optionally filtered by programming language." })
  @ApiQuery({ name: "language", required: false, description: "Filter by programming language (e.g. TypeScript, Python)", example: "TypeScript" })
  @ApiResponse({ status: 200, description: "Array of issues", type: [Issue] })
  async findAll(@Query("language") language?: string): Promise<Issue[]> {
    return this.issuesService.findAllIssues(language);
  }

  @Get("fetch-and-save/:owner/:repo")
  @ApiOperation({ summary: "Fetch and save good first issues from a GitHub repo", description: "Calls the GitHub API to fetch open issues labelled 'good first issue' from the given repo and persists them to the database." })
  @ApiParam({ name: "owner", description: "GitHub repository owner", example: "facebook" })
  @ApiParam({ name: "repo", description: "GitHub repository name", example: "react" })
  @ApiResponse({ status: 200, description: "Newly fetched and saved issues", type: [Issue] })
  async fetchAndSaveGoodFirstIssues(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
  ): Promise<Issue[]> {
    return this.issuesService.fetchAndSaveGoodFirstIssues(owner, repo);
  }
}
