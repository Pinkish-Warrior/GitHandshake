import { Controller, Get, Query, Param } from "@nestjs/common";
import { IssuesService } from "./issues.service";
import { Issue } from "./entities/issue.entity";

@Controller("issues")
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  async findAll(@Query("language") language?: string): Promise<Issue[]> {
    return this.issuesService.findAllIssues(language);
  }

  @Get("fetch-and-save/:owner/:repo")
  async fetchAndSaveGoodFirstIssues(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
  ): Promise<Issue[]> {
    return this.issuesService.fetchAndSaveGoodFirstIssues(owner, repo);
  }
}
