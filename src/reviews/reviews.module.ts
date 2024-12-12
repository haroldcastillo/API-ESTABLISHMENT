import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EstablishmentsModule } from 'src/establishments/establishments.module';
import { Reviews, ReviewsSchema } from './entities/reviews.entity';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reviews.name,
        schema: ReviewsSchema,
      },
    ]),
    EstablishmentsModule,
    UsersModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
