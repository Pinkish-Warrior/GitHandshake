import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './github.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'github' })],
  controllers: [AuthController],
  providers: [GithubStrategy],
})
export class AuthModule {}
