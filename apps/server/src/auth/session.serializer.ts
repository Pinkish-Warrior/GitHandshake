import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UsersService } from "../users/users.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    // Store only the user ID (as string to handle BigInt)
    done(null, user.id.toString());
  }

  async deserializeUser(
    userId: string,
    done: (err: Error, payload: any) => void,
  ): Promise<any> {
    try {
      // Fetch the user from database using the ID
      const user = await this.usersService.findOne(parseInt(userId, 10));
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
