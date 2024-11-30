
import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export const jwtConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '15m' },
  };
};

