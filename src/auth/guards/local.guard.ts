import { ExecutionContext, Injectable } from '@nestjs/common';
import  {AuthGuard} from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    return super.canActivate(context);
  }
}