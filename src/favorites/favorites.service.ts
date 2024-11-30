import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorites } from './entities/Favorites.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorites.name) private favoritesModel: Model<Favorites>,
  ) {}

  create(createFavoriteDto: CreateFavoriteDto) {
    const newFavorite = new this.favoritesModel({
      ...createFavoriteDto,
      createdAt: Date.now(),
    });
    return newFavorite.save();
  }

  findSelectedFavorites(Id: string, type: string) {
    return this.favoritesModel.find({ [type]: Id });
  }

  findAll() {
    return this.favoritesModel.find();
  }

  findMyFavorites(id: string) {
    return this.favoritesModel.find({ userId: id });
  }

  remove(id: number) {
    return this.favoritesModel.findByIdAndDelete(id);
  }
}
