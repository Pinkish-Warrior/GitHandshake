import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { GithubModule } from '../github/github.module'; // Import GithubModule

@Module({
  imports: [GithubModule], // Add GithubModule to imports
  providers: [IssuesService],
  controllers: [IssuesController],
})
export class IssuesModule {}
