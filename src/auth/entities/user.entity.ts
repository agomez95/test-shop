import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false   //con esto hace que no se muestre en ningun find que haga a la tabla
    })
    password: string;

    @Column('text')
    fullname: string;

    @Column('bool',{
        default: true
    })
    isActive: string;

    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[];
}
