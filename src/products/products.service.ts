import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource

  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const { images = [], ...productDetails } = createProductDto;
      // //si no existe el slug tomara el titulo q es requerido remplazando espacios por _ y apostrofe por string vacio.
      // //pero si existiese igual validamos por que seran datos q colocara el usuario. el codigo lo usamos en product.entity
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      }); //1.creamos en memoria

      //2.y posteriormente se guardara en la  Base de datos.
      await this.productRepository.save(product);

      return { ...product, images };

    } catch (error) {
      this.handleDBExeptions(error);
    }
  }
  //TODO:PAGINAR
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const product = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });

      return product.map(product => ({
        ...product,
        images: product.images.map(img => img.url)
      }))

    } catch (error) {
      console.log(error);
    }
  }

  //aqui haremos uso del Query Builder
  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {

      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder.where(
        `UPPER(title) =:title or slug=:slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    if (!product) {
      throw new NotFoundException(`Product with ${term} not found - producto no encontrado`);
    }

    return product
  }

  //'select * from Products where slug=xxx or   title=xxx'// mediante el query buildera lo que se quiere es construir algo similar
  //pero con el uso de esa herramienta aseguramos protegernos de inyecciones sql
  // product = await this.productRepository.findOneBy({ slug: term });
  // const product = await this.productRepository.findOneBy({ id });



  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    // const product = await this.findOne(term);


    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }


  //Para actualizar 
  // entonces buscara un producto on id , y cargaremos los datos opcionales que enviamos a travez del endpoint
  //entonces la linea de abajo solo prepara el registro a actualizar.
  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({ id, ...toUpdate });

    //Creamos un Queryrunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (!product) {
      throw new NotFoundException(`Product with ${id} not found - producto no encontrado`);
    }

    //si no da un error de no encontrado, solo queda guardarlo 
    try {
      if (images) {//cuando tenemos imagenes
        //1era. transaccion
        await queryRunner.manager.delete(ProductImage, { product: { id } }); //borramos las anteriores imagenes

        //sobreescribimos las imagenes 
        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        )
      }

      //opcion2
      // else{
      //   product.images=await this.productImageRepository.findBy({product:{id}})
      // }

      //2da. transaccion
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      // opcion2
      // return product

      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExeptions(error);
    }
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


  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query
      .delete()
      .where({})
      .execute();

    } catch (error) {
      this.handleDBExeptions(error);
    }
  }


}
