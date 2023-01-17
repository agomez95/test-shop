import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-images.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @OneToMany( // leer documentacion de todo esto
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true } // con esto acepto eliminacion en cascada y con eager es para hacer los finds de las relaciones
    )
    images?: ProductImage[];


    /**
     * @checkSlugInsert - funcion que hace que previo al insert en la bd cree el slug si
     * es que no es enviado
     */
    @BeforeInsert()
    checkSlugInsert() {
        if(!this.slug) this.slug = this.title;

        this.slug = this.slug.toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'');    
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if(this.slug) this.slug = this.slug.toLowerCase()
                            .replaceAll(' ','_')
                            .replaceAll("'",'');
    }
}

/// Decoramos nuestra clase entidad con Entity() - Para que pueda funcionar la importacion
/// definimos nuestras columnas de nuestra tabla


