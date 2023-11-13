import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


// en las @Entitys los que tienen el valor de unique deben ser evaluados en el Product.service
@Entity()
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
    sizes: string;

    @Column('text')
    gender: string


    //procedimiento para antes de insertar

    @BeforeInsert()
    checkSlugInsert() {

        // //si no existe el slug tomara el titulo q es requerido remplazando espacios por _ y apostrofe por string vacio.
        // //pero si existiese igual validamos por que seran datos q colocara el usuario.

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


    //  @BeforeUpdate

}
