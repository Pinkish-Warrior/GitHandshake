import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { GithubStrategy } from "./github.strategy";
import { SessionSerializer } from "./session.serializer";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "github", session: true }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [GithubStrategy, SessionSerializer],
})
export class AuthModule {}
