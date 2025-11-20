import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IssuesService } from './issues/issues.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const issuesService = app.get(IssuesService);
  const configService = app.get(ConfigService);
  const logger = new Logger('Seeder');

  logger.log('Starting database seeding...');

  // You can define a list of repositories to seed here
  const reposToSeed = [
    { owner: 'facebook', repo: 'react' },
    { owner: 'angular', repo: 'angular' },
    { owner: 'vuejs', repo: 'vue' },
    { owner: 'vercel', repo: 'next.js' },
    { owner: 'nestjs', repo: 'nest' },
    { owner: 'microsoft', repo: 'TypeScript' },
  ];

  for (const { owner, repo } of reposToSeed) {
    try {
      logger.log(`Fetching and saving good first issues for ${owner}/${repo}...`);
      const issues = await issuesService.fetchAndSaveGoodFirstIssues(owner, repo);
      logger.log(`Successfully saved ${issues.length} issues for ${owner}/${repo}.`);
    } catch (error) {
      logger.error(`Failed to seed issues for ${owner}/${repo}: ${error.message}`);
    }
  }

  logger.log('Database seeding completed.');
  await app.close();
}

bootstrap()
  .then(() => console.log('Seeding script finished successfully'))
  .catch((error) => {
    console.error('Seeding script failed:', error);
    process.exit(1);
  });
