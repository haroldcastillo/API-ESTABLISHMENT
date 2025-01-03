import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Request } from 'express';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Req() req: Request) {
    try {
      let result = await this.reviewsService.create(req.body);
      return {
        data: result,
        // accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
      return {
        status: 500,
      };
    }
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('establishment/:id')
  async findestablishmentReviews(@Param('id') id: string, @Req() req: Request) {
    try {
      let result = await this.reviewsService.findEstablishmentReviews(
        id,
        'establishmentId',
      );
      return {
        data: result,
        // accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
      return {
        status: 500,
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }
  @Get('totalReviews/:id')
  async totalReviews(@Param('id') id: string, @Req() req: Request) {
    try {
      let result = await this.reviewsService.totalReviewsForEstablishment(id);
      return {
        data: result,
        // accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
      return {
        status: 500,
      };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
