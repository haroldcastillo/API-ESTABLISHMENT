import { Controller, Get, Post, Body, Patch, Param, Delete,Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/Jwt.guard';
import { Request } from 'express';
import { EstablishmentsService } from 'src/establishments/establishments.service';
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private  favoritesService: FavoritesService, private establishmentServer: EstablishmentsService) {}

  @Post()
  async create(@Req() req: Request) {
    try {
      let result = await this.favoritesService.create(req.body);
      return {
        data : result,
        accessToken : req.user
      };
    } catch (error) {
      console.warn("Error", error);
    }
  }


  @Get()
  async findAll(@Req() req: Request) {
    try {
      let result = await this.favoritesService.findAll();;
      return {
        data : result,
        accessToken : req.user
      };
    } catch (error) {
      console.warn("Error", error);
    }
  }

  @Get('establishment/:id')
  async findestablishmentFavorites(@Param('id') id: string,@Req() req: Request) {
    try {
      let result = await this.favoritesService.findSelectedFavorites(id,'establishmentId');
      return {
        data : result,
        accessToken : req.user
      };
    } catch (error) {
      console.warn("Error", error);
    }
  }

  @Get('user/:id')
  async findUserFavorites(@Param('id') id: string,@Req() req: Request) {
    try {
      let result = await this.favoritesService.findSelectedFavorites(id,'userId');
      return {
        data : result,
        accessToken : req.user
      };
    } catch (error) {
      console.warn("Error", error);
    }
  }

  @Get("myfavorites/:id")
  async findMyFavorites(@Param('id') id: string, @Req() req: Request) {
    try {
      let establishmentValues = [];
      const myFavorites = await this.favoritesService.findSelectedFavorites(id, 'userId') as any;

      for (const element of myFavorites) {
        const establishmentValue = await this.establishmentServer.findOne(element.establishmentId);
        establishmentValues.push(establishmentValue);
      }

      console.log(establishmentValues);

      return {
        data: establishmentValues,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn("Error", error);
      return {
        message: "An error occurred while retrieving your favorites.",
        error: error.message,
      };
    }
  }


  @Delete(':id')
  async remove(@Param('id') id: number,@Req() req: Request) {
    try {
      let result = await this.favoritesService.remove(id);
      return {
        data : result,
        accessToken : req.user
      };
    } catch (error) {
      console.warn("Error", error);
    }
    return 
  }
}
