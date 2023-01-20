import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector /// ayuda a ver informacion que llega desde de los decoradores como la metadata
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // mediante el reflector guardo los roles en el nuevo array
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if(!validRoles || validRoles.length === 0) return true //si no recibo metada mando de frente true

    // al igual que en el getUser, asi obtengo el usuario del request
    const user = context.switchToHttp().getRequest().user as User; // a este usuario le doy un tipo mediante mi entidad

    if(!user) throw new UnauthorizedException('Token not valid')

    for(const role of user.roles) {
      if(validRoles.includes(role)) return true //si el rol de mi usuario es igual a los valido mando true
    }

    throw new ForbiddenException(`User '${user.fullname}' need a valid role: [${validRoles}]`) // sino pues mando un error
  }
}
