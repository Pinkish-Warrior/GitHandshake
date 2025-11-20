import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { GithubModule } from '../github/github.module';
import { Issue } from './entities/issue.entity';

@Module({
  imports: [GithubModule, TypeOrmModule.forFeature([Issue])],
  providers: [IssuesService],
  controllers: [IssuesController],
})
export class IssuesModule {}
