import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/Jwt.guard';
import { Request } from 'express';

@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request) {
    try {
      let result = await this.establishmentsService.create(req.body);
      return {
        data: result,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }

  @Get('addView/:id')
  async addView(@Req() req: Request, @Param('id') id: string) {
    try {
      let result = await this.establishmentsService.addView(id);
      return {
        data: result,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }

  @Get()
  async findAll(@Req() req: Request) {
    try {
      let result = await this.establishmentsService.findAll();
      return {
        data: result,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }

  @Post('recommendation')
  async recommendation(@Req() req: Request) {
    const { type, barangay, search, currentPage } = (await req.body) as {
      type: string[];
      barangay: string[];
      search: string;
      currentPage: number;
    };
    console.log(type, barangay, search, currentPage);
    try {
      let result = await this.establishmentsService.recommendation(
        type,
        barangay,
        search,
        currentPage,
      );
      console.log(result);
      return result;
    } catch (error) {
      console.warn('Error', error);
    }
  }

  @Get('owner/:id')
  @UseGuards(JwtAuthGuard)
  async myEstablishment(@Req() req: Request, @Param('id') id: string) {
    try {
      let result = await this.establishmentsService.myEstablishment(id);
      return {
        data: result,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.establishmentsService.findOne(id);
  }

  @Patch(':id') // Update
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Req() req: Request) {
    try {
      let result = await this.establishmentsService.update(
        id,
        req.body as UpdateEstablishmentDto,
      );
      return {
        data: result,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }

  @Patch('verify/:id') // Replace
  @UseGuards(JwtAuthGuard)
  async replace(@Param('id') id: string, @Req() req: Request) {
    try {
      let result = await this.establishmentsService.verify(id);
      return {
        data: result,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      let result = await this.establishmentsService.remove(id);
      return {
        data: result,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }


  @Get('lastViewed')
  @UseGuards(JwtAuthGuard)
  async lastViewed(@Req() req: Request) {
    
  }
}
