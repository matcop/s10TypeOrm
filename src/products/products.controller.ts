import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRolex } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Gestión de Productos')
@Controller('products')
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiResponse({status:201, description:'El Producto ha sido creado',type:Product})
  @ApiResponse({status:403, description:'El usuario no posee los permisos necesarios'})
  @ApiResponse({status:400, description:'El servidor no pudo Interpretar su mala peticion'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User
  
  ) {
    return this.productsService.create(createProductDto,user);
  }
 
  @Get()
  @Auth(ValidRolex.admin)
      findAll(@Query() paginationDto: PaginationDto) {
        // console.log(paginationDto)
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    // return this.productsService.findOnePlain(term);
    return this.productsService.findOne(term);
    
  }

  @Patch(':id')
  update(
    @Param('id',ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user:User
  ) {
    return this.productsService.update(id, updateProductDto,user );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
