import { Module } from '@nestjs/common';
import { BucketlistService } from './bucketlist.service';
import { BucketlistController } from './bucketlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bucketlist, BucketlistSchema } from './entities/Bucketlist.schema';
import { EstablishmentsModule } from 'src/establishments/establishments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bucketlist.name,
        schema: BucketlistSchema,
      },
    ]),
    EstablishmentsModule,
  ],
  controllers: [BucketlistController],
  providers: [BucketlistService],
})
export class BucketlistModule {}
