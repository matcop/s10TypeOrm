
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


// en las @Entitys los que tienen el valor de unique deben ser evaluados en el Product.service
@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '18f344fa-55f7-4ffa-90df-6d46c4c5c05a',
        description: 'Identificador del producto ',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ApiProperty({
        example: '18f344fa-55f7-4ffa-90df-6d46c4c5c05a',
        description: 'Titulo del producto ',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string

    @ApiProperty({
        example: 0,
        description: 'Precio del Producto ',
        uniqueItems: false
    })
    @Column('float', { default: 0 })
    price: number

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Equidem e bonum',
        description: 'Descripción del Producto ',
        uniqueItems: false
    })
    @Column({
        type: 'text',
        nullable: true

    })
    description: string


    @ApiProperty({
        example: 't_shirt',
        description: 'Etiqueta del Producto ',
    })
    @Column('text', {
        unique: true
    })
    slug: string

    @ApiProperty({
        example: 0,
        description: 'Cantidad del Producto en deposito',
        uniqueItems: true
    })
    @Column('int', {
        default: 0
    })
    stock: number;


    @ApiProperty({
        example: ['s','l','xl','xxl','xxxl'],
        description: 'Tamaños del Producto ',
        uniqueItems: false
    })
    @Column('text', {
        array: true
    })
    sizes: string[];
    // sizes: string;
    // sizes: Talla[]


    @ApiProperty({
        example: 'masculino',
        description: 'Genero del Producto ',
    })
    @Column('text')
    gender: string

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true,
            eager: true
        }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User

    //procedimiento para antes de insertar

    @BeforeInsert()
    checkSlugInsert() {

        // //si no existe el slug tomara el titulo q es requerido 
        //remplazando espacios por _ y apostrofe por string vacio.
        // //pero si existiese igual validamos por que seran datos
        // q colocara el usuario.

        if (!this.slug) {
            this.slug = this.title
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '')
        }
        else {
            this.slug = this.slug
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '')
        }

    }

    //procedimiento para antes de actualizar


    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')

    }


    //tags
    //images

}


// export enum Talla {
//     XS = "EXTRA PEQUEÑA",
//     S = "PEQUEÑA",
//     M = "MEDIANA",
//     L = "GRANDE",
//     XL = "EXTRA GRANDE",
//     XXL = "EXTRA EXTRA GRANDE",
// }