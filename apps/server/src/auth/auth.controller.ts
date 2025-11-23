import { Controller, Get, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // This route will redirect to GitHub for authentication
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback(@Res() res) {
    // Successful authentication, passport adds user to session and redirects.
    res.redirect('http://localhost:3000/');
  }

  @Get('status')
  getStatus(@Req() req) {
    if (req.user) {
      return { status: 'authenticated', user: req.user };
    } else {
      return { status: 'unauthenticated' };
    }
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.logout(() => {
      res.status(HttpStatus.OK).send();
    });
  }
}
