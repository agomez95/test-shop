import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from 'src/products/products.service';
import { initialData } from './interfaces/seed-data.interface';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
  ) {}

  async executeSeed() {

    this.insertNewProducts();

    return `Seed executed`;
  }

  private async insertNewProducts() {
    this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product));
    })

    /// con Promise.all espera a que todas las promesas de arriba se resuelvan y cuando se resuelvan que siga con la siguiente linea(el result true)
    await Promise.all(insertPromises);

    return true;
  }

}
