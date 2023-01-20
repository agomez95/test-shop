import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";

import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/";

@Injectable() /// con esto puedo injectarlo en cualquier modulo
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ) {
        super({ // el passportstrategy necesita la llave secreta
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    /**
     * 
     * @param payload - el token con la data de acceso, que se generara en el servicio de usuarios
     * @returns - el 'request' en forma de usuario, que sera accesible desde cualquier lado del back
     */
    async validate(payload: JwtPayload): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOneBy({id})

        if(!user) throw new UnauthorizedException('Token not valid')
        if(!user.isActive) throw new UnauthorizedException('User is inactive, talk with an admin')

        return user; 
    }
}

//  esto se llamara si el JWT no ha expirado o si la firma del JWT hace match con el payload
/**
 *  @jwtFromRequest - aqui se define de donde viene el token
 *  @ExtractJwt - Con esto declaromos que extraemos el Token
 *  @fromAuthHeaderAsBearerToken - aqui apuntamos a que la procedencia viene del header como un
 *  Bearer Token
 */