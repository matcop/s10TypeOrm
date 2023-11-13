import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundError, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>) {

  }

  async create(createProductDto: CreateProductDto) {

    try {
      // //si no existe el slug tomara el titulo q es requerido remplazando espacios por _ y apostrofe por string vacio.
      // //pero si existiese igual validamos por que seran datos q colocara el usuario. el codigo lo usamos en product.entity

      const product = this.productRepository.create(createProductDto); //creamos en memoria

      //y posteriormente se guardara en la  Base de datos.
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDBExeptions(error);
    }
  }
  //TODO:PAGINAR
  findAll() {
    try {
      return this.productRepository.find({});
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {


    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ${id} not found`);
    }

    return product;




    // return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne( id )

    await this.productRepository.remove(product);
    
  }


  private handleDBExeptions(error: any) {
    // console.log(error);
    if (error.code === '23505')
      throw new BadRequestException(error.detail);


    this.logger.error(error);
    throw new InternalServerErrorException('unexpected, check server logs')
  }
}
