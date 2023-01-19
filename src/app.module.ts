import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public') // npm i  @nestjs/serve-static
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule
  ],
})
export class AppModule {}

/**
 * @synchronize - Solo en desarrollo, si uno actualiza una tabla o columna en la db
 * lo sincroniza automaticamente, false siempre en produccion
 * @autoLoadEntities - 
 */