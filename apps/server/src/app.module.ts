import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GithubModule } from "./github/github.module";
import { IssuesModule } from "./issues/issues.module";
import { Issue } from './issues/entities/issue.entity';
import { User } from './users/entities/user.entity'; // Import User entity
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module'; // Import UsersModule

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Issue, User], // Add User to entities
        synchronize: process.env.NODE_ENV !== 'production', // This should be false in production
      }),
      inject: [ConfigService],
    }),
    GithubModule,
    IssuesModule,
    AuthModule,
    UsersModule, // Add UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
