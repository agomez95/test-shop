import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { Product, ProductImage } from './entities';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) {}

  /**
   * 
   * @param createProductDto - DTO post
   * @returns product - una instancia del producto creado con un @create 
   *          que a su ves, con un @save lo guarda en la BD
   */
  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto; // separo las imagenes enviadas del dto en un array por defecto de las otras propiedades

      const product = this.productRepository.create({
        ...productDetails, /// despliego las propiedades
        images: images.map( image => this.productImageRepository.create({ url: image }) ) // mapeo cada imagen para crearlas en un repositorio una por una
      }); 

      await this.productRepository.save(product); //se guarda el producto y las imagenes
      
      /// return `Added new product: "${product.slug}"`;
      return {...product, images}
    } catch(error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }));
  }

  async findOnePlain(term: string) {
    const { images=[], ...details} = await this.findOne(term);    

    return {...details, images: images.map(img => img.url)}
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const {images, ...toUpdate} = updateProductDto;
  
    // preload - buscar el producto por id y que cargue las propiedades sin las imagenes
    const product = await this.productRepository.preload({ id, ...toUpdate});
    
    if(!product) throw new BadRequestException(`Product with id '${id}' not found`);

    /**
     * @queryRunner - es como una linea de vida de un query programado, donde "intenta" hacer un update de las imagenes
     * borrando las primeras y luego creandolas para guardarlas, si falla hace un rollback para volver al principio y manda error
     */
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction()

    try {

      if(images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);

    }
  }

  async remove(id: string) {
    const { affected } = await this.productRepository.delete({id: id}) //el uso de remove tambien es valido, investigar

    if(affected === 0) throw new BadRequestException(`Product with id '${id}' not found`);

    return `Product with id '${id}' was removed`;
  }

  private handleDBException(error: any) {
    if(error.code === '23505') throw new BadRequestException(error.detail);
    
    this.logger.error(error) //si no es un error controlado lo imprimira en consola
    
    throw new InternalServerErrorException(`Unexpected error - check server logs`);
  }

  private async findOne(term: string) {
    let product: Product;

    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term }); solo slug
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(), // el title con UPPER y to.. arregla la capitulacion del nombre Polo Bi.... algo asi
          slug: term.toLowerCase(), // el slug siempr en minusculas
        })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();
    }

    if(!product) throw new NotFoundException(`Produc with id or slug "${term}" not found`)

    return product;
  }

  // bonus
  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('prod');

    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch(error) {
      this.handleDBException(error)
    }
    
  }
}

/** Metodo update - propio
 * async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.update(id, updateProductDto);
      return `Product with id '${id}' was updated`;
    } catch(error) {
      this.handleDBException(error);
    }
  }
 */