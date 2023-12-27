
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";


// en las @Entitys los que tienen el valor de unique deben ser evaluados en el Product.service
@Entity({name:'products'})
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string


    @Column('float', { default: 0 })
    price: number

    @Column({
        type: 'text',
        nullable: true

    })
    description: string


    @Column('text', {
        unique: true
    })
    slug: string

    @Column('int', {
        default: 0
    })
    stock: number;


    @Column('text', {
        array: true
    })
    sizes: string[];
    // sizes: string;
    // sizes: Talla[]


    @Column('text')
    gender: string

    @Column('text',{
        array:true,
        default:[]
    })
    tags: string[];


    @OneToMany(
        ()=>ProductImage,
        (productImage)=>productImage.product ,
        {
            cascade:true,
            eager:true
         }
    )
    images?: ProductImage[];

    
    
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
     checkSlugUpdate(){
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