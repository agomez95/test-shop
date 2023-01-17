import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    url: string;

    @ManyToOne( // leer documentacion de todo esto
        () => Product,
        (product) => product.images
    )
    product: Product;
}