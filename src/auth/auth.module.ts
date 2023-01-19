import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy: 'jwt'}), //definimos la estrategia para autenticacion que sera jwt
    /*JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '2h'
      }
    })*/
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          
        }
      }
    })
  ],
  exports: [TypeOrmModule]
})
export class AuthModule {}
