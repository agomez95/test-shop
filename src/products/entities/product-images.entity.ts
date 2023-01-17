import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name: 'product_images'})
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    url: string;

    @ManyToOne( // leer documentacion de todo esto
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' } // con esto acepto eliminacion en cascada
    )
    product: Product;
}