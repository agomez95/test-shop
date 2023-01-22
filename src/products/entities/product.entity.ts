import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { User } from "src/auth/entities/user.entity";
import { ProductImage } from "./product-images.entity";

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: '67a85960-76f4-4465-a918-4ede46d71eac',
        description: 'Product Id',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Polo Billabong',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 10,
        description: 'Product Price for selling',
        default: 0
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'This is a Shirt',
        description: 'Product Description for selling'
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 'polo_billabong',
        description: 'Product SLUG for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product Stock ',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ["S","M","L","XL"],
        description: 'Product Sizes '
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: "men",
        description: 'Product Gender',
        enum: ['men','women','kid','unisex']
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['shirt'],
        description: 'Product tags for Search'
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany( // leer documentacion de todo esto
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true } // con esto acepto eliminacion en cascada y con eager es para hacer los finds de las relaciones
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;

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


