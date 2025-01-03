import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Journey, JourneySchema } from './entities/Journey.schema';
import { EstablishmentsModule } from 'src/establishments/establishments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Journey.name,
        schema: JourneySchema,
      },
    ]),
    EstablishmentsModule,
  ],
  controllers: [JourneyController],
  providers: [JourneyService],
})
export class JourneyModule {}
