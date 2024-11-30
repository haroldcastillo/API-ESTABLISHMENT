import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorites, FavoritesSchema } from './entities/Favorites.schema';
import { AuthModule } from 'src/auth/auth.module';
import { EstablishmentsModule } from 'src/establishments/establishments.module';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Favorites.name,
        schema: FavoritesSchema,
      },
    ]),
    EstablishmentsModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
