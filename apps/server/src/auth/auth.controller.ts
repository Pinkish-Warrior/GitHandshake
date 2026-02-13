import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get("github")
  @UseGuards(AuthGuard("github"))
  githubAuth() {
    // This route will redirect to GitHub for authentication
  }

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    // Explicitly call req.login to serialize user into session
    await new Promise<void>((resolve, reject) => {
      req.login(req.user!, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.json({ status: "authenticated", user: req.user });
  }

  @Get("status")
  getStatus(@Req() req: Request) {
    if (req.user) {
      return { status: "authenticated", user: req.user };
    } else {
      return { status: "unauthenticated" };
    }
  }

  @Get("logout")
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {
      res.status(HttpStatus.OK).send();
    });
  }
}
