import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
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
  githubAuthCallback(@Req() req, @Res() res) {
    // Successful authentication, redirect to the frontend.
    // In a real application, you would handle the user session here.
    res.redirect('http://localhost:3000/');
  }
}
