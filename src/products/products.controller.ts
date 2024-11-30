import { Controller, Get, Post, Body, Patch, Param,Req, Delete ,ValidationPipe} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/Jwt.guard';
import { UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService,private readonly authService:AuthService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body(ValidationPipe) createProductDto: CreateProductDto,@Req() req: Request) {
    try {
      let result = await this.productsService.create(createProductDto)
      return {
        data : result,
        accessToken : req.user
      };
    } catch (error) {
      console.warn("Error", error);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request) {
    let result = await this.productsService.findAll()
    return {
      data: result,
      accessToken: req.user
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    let result = this.productsService.findOne(id);
    return {
      data: result,
      accessToken: req.user
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
