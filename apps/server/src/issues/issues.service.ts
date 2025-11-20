import { Injectable } from '@nestjs/common';
import { GithubService } from '../github/github.service'; // Adjust path if needed

@Injectable()
export class IssuesService {
  constructor(private readonly githubService: GithubService) {}

  async getGoodFirstIssues(owner: string, repo: string): Promise<any[]> {
    return this.githubService.findGoodFirstIssues(owner, repo);
  }
}
