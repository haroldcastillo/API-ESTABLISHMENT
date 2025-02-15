import {
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/Jwt.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { stat } from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private UserService: UsersService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { _id } = req.user as { _id: string };

      const refreshToken = await this.authService.generateRefreshToken({ _id });
      const accessToken = await this.authService.generateAccessToken({
        refreshToken,
      });
      // Set the refresh token in an HTTP-only cookie
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Set to true in production with HTTPS
        sameSite: 'none', // Set to 'none' in production with HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });
      return {
        accessToken,
        userId: _id,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('google-login')
  async googleLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.UserService.findOne(req.body.email, 'email');

      if (!user) {
        return {
          message: 'User not found',
          status: 404,
        };
      }
      const _id = user._id;

      const refreshToken = await this.authService.generateRefreshToken({ _id });
      const accessToken = await this.authService.generateAccessToken({
        refreshToken,
      });
      // Set the refresh token in an HTTP-only cookie
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Set to true in production with HTTPS
        sameSite: 'none', // Set to 'none' in production with HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return {
        accessToken,
        userId: _id,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('register')
  async register(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(req.body);
    try {
      const user = (await this.UserService.create(
        req.body as CreateUserDto,
      )) as { _id: string; email: string; name: string };
      await this.authService.sendVerificationEmail(user.email, user._id);

      return {
        userId: user._id,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('verifyAgain/:id')
  async getNewVerificationLink(@Req() req: Request) {
    try {
      const { id } = req.params;
      const user = await this.UserService.findOne(id, 'id');
      console.log(user);
      if (!user) throw new BadRequestException('User not found');
      if (user.isVerified)
        throw new BadRequestException('User already verified');
      const userId = user._id.toString();
      await this.authService.sendVerificationEmail(user.email, userId);
      return { message: 'Verification link sent' };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status(@Req() req: Request) {
    try {
      const accessToken = req.user;
      const refreshTokenContent = await this.authService.tokenDecoder(
        this.authService.tokenDecoder(accessToken).refreshToken,
      );
      return {
        accessToken: accessToken,
        userId: refreshTokenContent._id,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get(`verify/:id`)
  async verify(@Req() req: Request) {
    try {
      const { id } = req.params;
      await this.UserService.verifyUser(id);
      return { message: 'User verified', status: 200 };
    } catch (e) {
      return { message: 'Invalid Token', status: 400 };
    }
  }
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', {
      httpOnly: true, // Set to true if your cookie was HttpOnly
      secure: true, // Set to true if your cookie was Secure
      sameSite: 'none', // Set SameSite option if it was used
      path: '/', // Set path option if it was used
    });

    return { message: 'Loggedout' };
  }

  @Post('forgot-password')
  async forgotPassword(@Req() req: Request) {
    try {
      const { email } = req.body;
      const user = await this.UserService.findOne(email, 'email');
      if (!user) throw new BadRequestException('Invalid Email');
      if (!user.isVerified) throw new BadRequestException('Email not verified');
      const userId = user._id.toString();
      const expiryDate = await this.authService.createExpiryDate();
      const message = await this.authService.sendPasswordResetEmail(
        email,
        userId,
        expiryDate,
      );

      return {
        expiryDate: expiryDate,
        message: message,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('reset-password/:id')
  async resetPassword(@Req() req: Request) {
    try {
      const { id } = req.params;
      const { password } = req.body;
      await this.UserService.changePassword(id, password);
      return { message: 'Password reset successful' };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
