import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { EstablishmentsModule } from './establishments/establishments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    ProductsModule,
    EstablishmentsModule,
    FavoritesModule
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
