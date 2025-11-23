import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3001/api/auth/github/callback',
      scope: ['read:user', 'public_repo'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    // In a real application, you would save the user to your database here.
    // For this example, we'll just return the user's profile and accessToken.
    return {
      profile,
      accessToken,
    };
  }
}
