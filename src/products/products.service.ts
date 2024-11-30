import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from './entities/Products.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor( @InjectModel(Products.name) private productModel: Model<Products>){}
  create(createProductDto: CreateProductDto) {
    const newProduct = new this.productModel({...createProductDto,createdAt:Date.now()});
    return newProduct.save();
  }

  findAll() {
    return this.productModel.find();
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id,updateProductDto,{new:true});
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
