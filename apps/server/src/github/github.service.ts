import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(private readonly configService: ConfigService) {}

  getGithubAppId(): string {
    return this.configService.get<string>('GITHUB_APP_ID');
  }
}
