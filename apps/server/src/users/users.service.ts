import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOrCreate(
    githubId: number,
    githubUsername: string,
    avatarUrl: string,
  ): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { id: githubId } });

    if (!user) {
      user = this.usersRepository.create({
        id: githubId,
        github_username: githubUsername,
        avatar_url: avatarUrl,
      });
    }

    user.last_login = new Date();
    return this.usersRepository.save(user);
  }

  async findOne(githubId: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: githubId } });
  }
}
