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
  githubAuthCallback(@Res() res: Response) {
    const clientUrl = this.configService.get<string>(
      "CLIENT_URL",
      "http://localhost:3000",
    );
    res.redirect(clientUrl);
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
