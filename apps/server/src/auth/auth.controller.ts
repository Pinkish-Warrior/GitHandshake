import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  @Get("github")
  @UseGuards(AuthGuard("github"))
  @ApiOperation({ summary: "Initiate GitHub OAuth login", description: "Redirects the user to GitHub to authorize the application. Handled via the Next.js client proxy at /api/auth/github." })
  @ApiResponse({ status: 302, description: "Redirect to GitHub OAuth" })
  githubAuth() {
    // This route will redirect to GitHub for authentication
  }

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  @ApiExcludeEndpoint()
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    await new Promise<void>((resolve, reject) => {
      req.login(req.user!, (err: Error) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.json({ status: "authenticated", user: req.user });
  }

  @Get("status")
  @ApiOperation({ summary: "Check authentication status", description: "Returns whether the current session is authenticated and the user profile if so." })
  @ApiResponse({ status: 200, description: "Authentication status", schema: { example: { status: "authenticated", user: { id: 1, github_username: "octocat" } } } })
  getStatus(@Req() req: Request) {
    if (req.user) {
      return { status: "authenticated", user: req.user };
    } else {
      return { status: "unauthenticated" };
    }
  }

  @Get("logout")
  @ApiOperation({ summary: "Log out", description: "Destroys the current session and logs the user out." })
  @ApiResponse({ status: 200, description: "Successfully logged out" })
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {
      res.status(HttpStatus.OK).send();
    });
  }
}
