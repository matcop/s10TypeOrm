import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  private readonly logger = new Logger('SeedService-mat');

  constructor(
    private readonly productService: ProductsService
  ) { }

  async runSeed() {

    await this.insertNewProducts();
    return `1.- Se borraron datos de la BD \n 2.- Nuevos registros en la BD`;
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];
    products.forEach(product => {
      insertPromises.push(this.productService.create(product));
    });
    await Promise.all(insertPromises);
    this.logger.log('Seed ha sido ejecutado');
    return true
  }

}
