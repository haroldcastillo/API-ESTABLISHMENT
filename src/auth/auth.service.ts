import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.userService.findOne(email, 'email');
    console.log(user);
    if (!user) throw new UnauthorizedException('Invalid Email');
    if (!user || !comparePassword(password, user.password))
      throw new UnauthorizedException('Invalid Password');
    if (!user.isVerified) throw new UnauthorizedException('Email not verified');
    const { password: _, ...userNoPassword } = user.toObject();

    return userNoPassword;
  }

  sendVerificationEmail(email: string, id: string) {
    const htmlContent = ` <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <h2 style="text-align: center; color: #4CAF50;">Welcome at Marikina</h2>
    <div style="margin-top: 20px; line-height: 1.6;">
        <p>Hello ${email},</p>
        <p>Welcome to @Marikina! Were thrilled to have you on board and can't wait to help you discover the best spots in Marikina City. Whether you're looking for hidden gems, local favorites, or must-see attractions, we've got you covered!</p>
        <p>To ensure the security of your account and to start exploring all that Marikina has to offer, please verify your email by clicking the link below:</p>
        <a href="https://atmarikina.vercel.app/verify/${id}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify My Account</a>
        <p style="margin-top:20px">If you didnt register on Marikina Destinations, please ignore this email.</p>
        <p>Thank you for joining us, and get ready for an exciting journey exploring Marikina!</p>
    </div>
    <div style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
        <p>Warm regards,</p>
        <p>The Marikina Destinations Team</p>
    </div>
</div>`;
    this.mailService.sendMail(
      email,
      'Welcome to Marikina Destinations! Please Verify Your Account to Start Exploring',
      `Hello, please verify your account here: https://atmarikina.vercel.app/verify/${id}`, // Plain text version
      htmlContent, // HTML content
    );
  }

  async sendPasswordResetEmail(email: string, id: string, expiryDate: number) {
    const htmlContent = `<div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; color: #4CAF50;">Reset Password</h2>
          <div style="margin-top: 20px; line-height: 1.6;">
              <p>Dear ${email},</p>
              <p>We received a request to reset the password for your account associated with this email address. If you made this request, please click the button below to reset your password:</p>
              <a href="https://atmarikina.vercel.app/reset-password/${id}/${expiryDate}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify My Account</a>
              <p style="margin-top:20px">If you dont request for reset, Somone is trying to access your account, If you have any questions, feel free to contact our support team.</p>
              <p>Thank you,</p>
          </div>
          <div style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
              <p>Warm regards,</p>
              <p>The Marikina Destinations Team</p>
          </div>
      </div>
    `;
    this.mailService.sendMail(
      email,
      'Reset Password',
      `Hello, please reset your password here: https://atmarikina.vercel.app/reset-password/${id}/${expiryDate}`, // Plain text version
      htmlContent, // HTML content
    );
    return 'Reset link sent';
  }

  // Generate the refresh token
  generateRefreshToken(payload: Object) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
    });
  }

  // Generate the access token
  generateAccessToken(payload: Object) {
    return this.jwtService.sign(payload);
  }

  // Decode the token
  tokenDecoder(token) {
    console.log(this.jwtService.decode(token));
    return this.jwtService.decode(token);
  }

  // Check if the access token is expired if not return the token else generate a new access token
  accessTokenExpirationChecker(token) {
    const decoded = this.tokenDecoder(token);
    if (Date.now() < decoded.exp * 1000) {
      return token;
    } else {
      return this.generateAccessToken({ refreshToken: decoded.refreshToken });
    }
  }

  // forgot password
  async forgotPassword(email: string) {
    const user = await this.userService.findOne(email, 'email');
    if (!user) throw new UnauthorizedException('Invalid Email');
    if (!user.isVerified) throw new UnauthorizedException('Email not verified');
    const userId = user._id.toString();
    await this.sendVerificationEmail(email, userId);
    return { message: 'Verification link sent' };
  }

  async createExpiryDate(): Promise<number> {
    const now = new Date(); // Get the current date and time
    now.setMinutes(now.getMinutes() + 5); // Add 5 minutes
    return now.getTime(); // Return the timestamp in milliseconds
  }
}
