import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './interfaces/seed-data.interface';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async executeSeed() {

    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser);

    return `Seed executed`;
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
    .delete()
    .where({})
    .execute()
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach(user => {
      user.password = bcrypt.hashSync(user.password,10),
      users.push(this.userRepository.create(user)) // por cada usuario en el seed se crea un usuario 
    });
    const dbUsers = await this.userRepository.save(seedUsers); // se guardan los usuarios
    return dbUsers[0]
  }

  private async insertNewProducts(user: User) {
    this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user));
    })

    /// con Promise.all espera a que todas las promesas de arriba se resuelvan y cuando se resuelvan que siga con la siguiente linea(el result true)
    await Promise.all(insertPromises);

    return true;
  }

}


/**
 * Para hacer el seed de borrado de todas las tablas se hizo lo siguiente:
 * 1. Se hizo el private async deleteTables()
 * 2. Se importo el repositorio de Usuario
 * 3. Se hizo un querybuilder para borrar todos los usuarios(el delete para borrar todo el repo, el where vacio para que sea todo y el execute para hacer)
 * 4. Se edito el seed interface donde se agrego: interface(SeedUser), se edito: SeedData(SeedUser+) y InitialData(users+)
 * 5. Se hizo la funcion private async insertUsers() donde retornamos el usuario admin
 * 6. Se edito el executeSeed() donde borramos todo, creamos usuarios y luego creamos productos
 */