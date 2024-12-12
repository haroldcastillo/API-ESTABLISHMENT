import {
  Post,
  Controller,
  Get,
  Body,
  Patch,
  Param,
  NotFoundException,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/Jwt.guard';
import { Request } from 'express';
import { last } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request) {
    try {
      const users = await this.usersService.findAll();
      return {
        data: users,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const response = await this.usersService.findOne(id, 'id');
      return {
        _id: response._id,
        email: response.email,
        name: response.name,
        createdAt: response.createdAt,
        role: response.role,
        image: response.image,
        preferences: response.preferences,
        contactNumber: response.contactNumber,
        Image: response.image || '',
        lastViewed: response.lastViewed,
      };
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Patch('preferences/:id')
  @UseGuards(JwtAuthGuard)
  updatePreferences(@Param('id') id: string, @Body() value: string[]) {
    return this.usersService.updatePreferences(id, value);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Req() req: Request) {
    const { name, contactNumber, image } = (await req.body) as {
      name: string;
      contactNumber: string;
      image: string;
    };
    try {
      return {
        data: await this.usersService.update(id, {
          name,
          contactNumber,
          image,
        }),
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }

  @Patch('password/:id')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Param('id') id: string, @Req() req: Request) {
    const { password, newPassword } = await req.body;

    try {
      const updatedUser = await this.usersService.updatePassword(
        id,
        password,
        newPassword,
      );
      return {
        data: updatedUser,
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error:', error.message);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('lastview/:id')
  // @UseGuards(JwtAuthGuard)
  async addLastViewedEstablishment(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    try {
      const { establishmentId } = await req.body;
      return {
        data: await this.usersService.addLastViewed(id, establishmentId),
        accessToken: req.user,
      };
    } catch (error) {
      console.warn('Error', error);
    }
  }
}
