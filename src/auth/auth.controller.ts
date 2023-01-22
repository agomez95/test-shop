import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators/';

import { CreateUserDto, LoginUserDto } from './dto/';
import { User } from './entities/user.entity';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  /**
   * @Auth - El decorator principal, se envia solamente el rol, si no se envia pasa cualquiera
   * y fijarse que no expire el token
   */
  @Auth(ValidRoles.user)
  finalPrivateRoute(@GetUser() user: User){
    return user;
  }

  /// se supone que esto hace un relogin en teoria, digamos que valida la sesion existente para evitar que el token este vacio y generar un nuevo con data
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  /*  Pruebas de Custom Guards y Decorators
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Works',
      user: {
        name: 'alessia',
        user,
        rawHeaders
      }
    }
  }

  @Get('private2')
  //para el determinar los roles
  //@SetMetadata('roles', ['admin','super-user']) // manera1: aqui añadimos informacion extra al controlador por medio de este decorador - no recomendable
  @RoleProtected(ValidRoles.user, ValidRoles.admin, ValidRoles.superUser) //manera2: este custom decorator provee los roles de una manera controlada
  @UseGuards(AuthGuard(), UserRoleGuard) // UserRoleGuard: guard de verificacion de roles
  testingPrivateRoute2(@GetUser() user: User, ) {
    return {
      ok: true,
      message: 'Works',
      user
    }
  }*/
}


/**
 * Los Custom Decoratos
 * Ver Word
 */