import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

@Injectable()
export class GithubService {
  private auth: any;

  constructor(private readonly configService: ConfigService) {
    const appId = this.configService.get<number>('GITHUB_APP_ID');
    const privateKey = this.configService.get<string>('GITHUB_PRIVATE_KEY');
    const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECRET');

    if (!appId || !privateKey || !clientId || !clientSecret) {
      throw new InternalServerErrorException('Missing GitHub App configuration environment variables.');
    }

    this.auth = createAppAuth({
      appId,
      privateKey,
      clientId,
      clientSecret,
    });
  }

  getGithubAppId(): number {
    return this.configService.get<number>('GITHUB_APP_ID');
  }

  private async getInstallationOctokit(owner: string, repo: string): Promise<Octokit> {
    const installation = await new Octokit({ authStrategy: this.auth, auth: { type: 'app' } }).request('GET /repos/{owner}/{repo}/installation', {
      owner,
      repo,
    });

    const installationId = installation.data.id;
    const installationAuth = await this.auth({
      type: 'installation',
      installationId,
    });

    return new Octokit({ auth: installationAuth.token });
  }

  async findGoodFirstIssues(owner: string, repo: string): Promise<any[]> {
    const octokit = await this.getInstallationOctokit(owner, repo);

    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      labels: 'good first issue', // Filter by 'good first issue' label
    });

    return issues;
  }
}
