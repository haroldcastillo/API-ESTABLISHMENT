import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EstablishmentsModule } from './establishments/establishments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { MailService } from './mail/mail.service';
import { ReviewsModule } from './reviews/reviews.module';
import { BucketlistModule } from './bucketlist/bucketlist.module';
import { JourneyModule } from './journey/journey.module';

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
        // uri: configService.get<string>('MONGODB_URI'),
        uri: 'mongodb+srv://haroldjamescastillo1:beRmjGASOEzd41VY@establishment.if6qe.mongodb.net/',
        // uri: 'mongodb://localhost:27017/ESTABLISHMENT-RECOMMENDATION-SYSTEM',
      }),
    }),
    AuthModule,
    ProductsModule,
    EstablishmentsModule,
    FavoritesModule,
    ReviewsModule,
    BucketlistModule,
    JourneyModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
