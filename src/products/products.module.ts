import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from 'src/common/common.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    CommonModule
  ],
  exports: [
    ProductsService,
    TypeOrmModule //esto es para exportar especificamente lo que importamos arriba(product,productsimage)
  ]
})
export class ProductsModule {}

/// mediante las importaciones del TypeOrmModule importamos las entidades