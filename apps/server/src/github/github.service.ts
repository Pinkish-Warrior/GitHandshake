import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

@Injectable()
export class GithubService {
  private auth: any;

  constructor(private readonly configService: ConfigService) {
    const appId = this.configService.get<number>("GITHUB_APP_ID");
    const privateKey = this.configService.get<string>("GITHUB_PRIVATE_KEY");
    const clientId = this.configService.get<string>("GITHUB_CLIENT_ID");
    const clientSecret = this.configService.get<string>("GITHUB_CLIENT_SECRET");

    if (!appId || !privateKey || !clientId || !clientSecret) {
      if (this.configService.get<string>("NODE_ENV") === "production") {
        throw new InternalServerErrorException(
          "Missing GitHub App configuration environment variables.",
        );
      }
      return;
    }

    this.auth = createAppAuth({
      appId,
      privateKey,
      clientId,
      clientSecret,
    });
  }

  getGithubAppId(): number | undefined {
    return this.configService.get<number>("GITHUB_APP_ID");
  }

  private async getInstallationOctokit(
    owner: string,
    repo: string,
  ): Promise<Octokit> {
    const appAuthentication = await this.auth({ type: "app" });
    const appOctokit = new Octokit({ auth: appAuthentication.token });

    const { data: installation } = await appOctokit.apps.getRepoInstallation({
      owner,
      repo,
    });

    const installationAuthentication = await this.auth({
      type: "installation",
      installationId: installation.id,
    });

    return new Octokit({ auth: installationAuthentication.token });
  }

  async getRepoLanguage(owner: string, repo: string): Promise<string | null> {
    const token = this.configService.get<string>("GITHUB_TOKEN");
    const octokit = new Octokit({ auth: token });

    const { data } = await octokit.rest.repos.get({ owner, repo });
    return data.language || null;
  }

  async findGoodFirstIssues(owner: string, repo: string): Promise<any[]> {
    const token = this.configService.get<string>("GITHUB_TOKEN");
    const octokit = new Octokit({ auth: token });

    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: "open",
      labels: "good first issue",
    });

    return issues;
  }
}
