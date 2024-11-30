import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService, // Add the AuthService dependency
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request):string => {
        let refreshToken = null;
        
        if (request && request.cookies) refreshToken = request.cookies['refreshToken']; // Get the refresh token from the HTTP-only cookie
        
        if (request.headers.authorization) {
          const accessToken = request.headers.authorization.split(' ')[1];
          if (refreshToken !== this.authService.tokenDecoder(accessToken).refreshToken) throw new ForbiddenException("Invalid Token");
        }

        return refreshToken
      }]),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(req: Request, payload: any) {
    if(req.headers.authorization) {
      const token = await this.authService.accessTokenExpirationChecker(req.headers.authorization.split(' ')[1]);// Check if the access token is expired
      return token;
    }else{
      return this.authService.generateAccessToken({refreshToken:req.cookies['refreshToken']}) // Generate a new access token
    }
  }
}
