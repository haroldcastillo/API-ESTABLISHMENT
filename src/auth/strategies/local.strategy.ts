import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local';
import { AuthService } from "../auth.service";
import { Injectable ,UnauthorizedException} from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private authservice:AuthService){
    super({
      usernameField: 'email', // specify the username field
      passwordField: 'password', // specify the password field
    });
  }
  async validate(email:string,password:string){
    const user = await this.authservice.validateUser({ email, password });
    if(!user)throw new UnauthorizedException('User not found');
    return user;
  }
}