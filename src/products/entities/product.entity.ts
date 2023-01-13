import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    title: string;

    @Column('numeric', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text'
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('numeric', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[];

    @Column('text')
    genter: string;
}

/// Decoramos nuestra clase entidad con Entity() - Para que pueda funcionar la importacion
/// definimos nuestras columnas de nuestra tabla