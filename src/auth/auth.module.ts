import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // injectamos el strategy jwt creado 
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy: 'jwt'}), //definimos la estrategia para autenticacion que sera jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy, // con esto podemos hacer verificaciones de forma manual en determinados puntos
    PassportModule,
    JwtModule
  ]
})
export class AuthModule {}


/**
 * @PassportModule - como bien dije arriba, es la definicion de una estrategia de configuracion,
 * donde definimos dentro el modulo que usaremos para la tarea ya descrita.
 * @JwtModule - registerAsync es para registrar un modulo asincrono que asegura que las variables
 * de entorno esten previamente configuradas antes de definirlas haciendo que la configuracion 
 * del modulo dependa de otro modulo, que en este caso es el ConfigModule (que uso para injectar
 * las variables de entorno)
 */