import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true //false
    }),
    ProductsModule,
    CommonModule
  ],
})
export class AppModule {}

/**
 * @synchronize - Solo en desarrollo, si uno actualiza una tabla o columna en la db
 * lo sincroniza automaticamente, false siempre en produccion
 * @autoLoadEntities - 
 */