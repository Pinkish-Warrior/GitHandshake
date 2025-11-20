import { Controller, Get, Query } from '@nestjs/common';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get('good-first')
  async getGoodFirstIssues(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
  ): Promise<any[]> {
    return this.issuesService.getGoodFirstIssues(owner, repo);
  }
}
