import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import { IssuesModule } from './issues/issues.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GithubModule, IssuesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
