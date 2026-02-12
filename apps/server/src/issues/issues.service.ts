import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GithubService } from "../github/github.service";
import { Issue } from "./entities/issue.entity";

@Injectable()
export class IssuesService {
  constructor(
    private readonly githubService: GithubService,
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
  ) {}

  async fetchAndSaveGoodFirstIssues(
    owner: string,
    repo: string,
  ): Promise<Issue[]> {
    const [githubIssues, repoLanguage] = await Promise.all([
      this.githubService.findGoodFirstIssues(owner, repo),
      this.githubService.getRepoLanguage(owner, repo),
    ]);
    const issuesToSave = githubIssues.map((issue) => ({
      githubIssueId: issue.id,
      repoName: repo,
      issueUrl: issue.html_url,
      title: issue.title,
      language: repoLanguage,
      labels: issue.labels.map((label: { name: string }) => label.name),
      createdAtGithub: new Date(issue.created_at),
      updatedAtGithub: new Date(issue.updated_at),
      fetchedAt: new Date(),
    }));

    // Save issues, handling potential duplicates
    const savedIssues: Issue[] = [];
    for (const issue of issuesToSave) {
      const existingIssue = await this.issuesRepository.findOne({
        where: { githubIssueId: issue.githubIssueId },
      });
      if (existingIssue) {
        // Update existing issue
        await this.issuesRepository.update(existingIssue.id, issue);
        savedIssues.push({ ...existingIssue, ...issue });
      } else {
        // Save new issue
        const newIssue = this.issuesRepository.create(issue);
        savedIssues.push(await this.issuesRepository.save(newIssue));
      }
    }
    return savedIssues;
  }

  async findAllIssues(language?: string): Promise<Issue[]> {
    if (language) {
      return this.issuesRepository.find({ where: { language } });
    }
    return this.issuesRepository.find();
  }
}
