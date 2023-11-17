import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundError, of, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

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

      const product = this.productRepository.create(createProductDto); //1.creamos en memoria

      //2.y posteriormente se guardara en la  Base de datos.
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDBExeptions(error);
    }
  }
  //TODO:PAGINAR
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      return this.productRepository.find({
        take: limit,
        skip: offset
      });

    } catch (error) {
      console.log(error);
    }
  }


  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      product = await this.productRepository.findOneBy({ slug: term });

    }
    // const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ${term} not found - producto no encontrado`);
    }

    return product;
  }


  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }


  async remove(id: string) {
    const product = await this.findOne(id)

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
