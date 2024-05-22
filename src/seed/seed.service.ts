import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {

  private readonly logger = new Logger('SeedService-mat');

  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser);
    return `1.- Se borraron datos de la BD \n 2.- Nuevos registros en la BD`;
  }


  private async deleteTables() {
    //1ro borrara los productos
    await this.productService.deleteAllProducts();

    //2do. borrara los usuarios
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
      users.push(this.userRepository.create(user))
    });
    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0];
  }


  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts();


    const products = initialData.products;
    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);
    this.logger.log('Seed ha sido ejecutado');
    return true
  }

}
