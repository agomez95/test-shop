import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto/';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepostory: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData} = createUserDto;
      const user = await this.userRepostory.create({
        ...userData,
        password: bcrypt.hashSync(password,10)
      });
      await this.userRepostory.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
    } catch(error) {
      this.handleDBException(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepostory.findOne({
      where: { email },
      select: { id: true, email: true, password: true }
    });

    if(!user) throw new BadRequestException(`Credentials are not valid (email)`);

    if(!bcrypt.compareSync(password,user.password)) throw new BadRequestException(`Credentials are not valid (password)`);

    return {
      token: this.getJwtToken({ id: user.id }) // la interfaz payload recibe siempre un objecto con el email
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBException(error: any): never {
    if(error.code === '23505') throw new BadRequestException(error.detail);    
    this.logger.error(error)     
    throw new InternalServerErrorException(`Unexpected error - check server logs`);
  }
}


/// instalaciones 1: npm i bcrypt ; npm i -D @types/bcrypt
/// instalaciones 2: npm i passport @nestjs/passport passport-jwt @nestjs/jwt ; npm i -D @types/passport-jwt