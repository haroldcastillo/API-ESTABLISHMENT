import { Module, forwardRef } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { EstablishmentsController } from './establishments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Establishments,
  EstablishmentsSchema,
} from './entities/Establishments.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Establishments.name,
        schema: EstablishmentsSchema,
      },
    ]),
  ],
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService],
  exports: [EstablishmentsService],
})
export class EstablishmentsModule {}
