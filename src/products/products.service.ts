import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

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
      this.handleDBException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {
    let product: Product;

    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      product = await this.productRepository.findOneBy({ slug: term });
    }

    if(!product) throw new NotFoundException(`Produc with id or slug "${term}" not found`)

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const { affected } = await this.productRepository.delete({id: id}) //el uso de remove tambien es valido, investigar

    if(affected === 0) throw new BadRequestException(`Product with id '${id}' doesn't exists`);

    return `Product with id '${id}' was removed`;
  }

  private handleDBException(error: any) {
    if(error.code === '23505') throw new BadRequestException(error.detail);
    
    this.logger.error(error) //si no es un error controlado lo imprimira en consola
    
    throw new InternalServerErrorException(`Unexpected error - check server logs`);
  }
}