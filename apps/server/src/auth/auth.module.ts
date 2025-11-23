import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './github.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'github', session: true })],
  controllers: [AuthController],
  providers: [GithubStrategy, SessionSerializer],
})
export class AuthModule {}
