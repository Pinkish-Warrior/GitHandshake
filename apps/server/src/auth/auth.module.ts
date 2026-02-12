import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { GithubStrategy } from "./github.strategy";
import { SessionSerializer } from "./session.serializer";

@Module({
  imports: [PassportModule.register({ session: true }), UsersModule],
  controllers: [AuthController],
  providers: [GithubStrategy, SessionSerializer],
})
export class AuthModule {}
