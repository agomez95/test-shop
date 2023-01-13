import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  /**
   * 
   * @param createProductDto - DTO post
   * @returns product - una instancia del producto creado con un @create 
   *          que a su ves, con un @save lo guarda en la BD
   */
  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto); 
      await this.productRepository.save(product);
      return product;
    } catch(error) {
      console.log(error);
      throw new InternalServerErrorException('Error')
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
