import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UsersService } from "../users/users.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, user: any) => void): void {
    done(null, user.id.toString());
  }

  async deserializeUser(
    userId: string,
    done: (err: Error | null, payload: any) => void,
  ): Promise<void> {
    try {
      const user = await this.usersService.findOne(parseInt(userId, 10));
      done(null, user);
    } catch (error) {
      done(error as Error, null);
    }
  }
}
