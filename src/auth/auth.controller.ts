import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RowHeaders } from './decorators/row-headers.decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';

import { ValidRolex, ValidRoles } from './interfaces/index';
import { Auth } from './decorators';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Login - Gestión de Usuarios')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }


  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:User
  ) {
    return this.authService.checkAuthStatus(user);
  }





  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @RowHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log({user});
    console.log({ rawHeaders });

    // console.log({user: request.user});
    return {
      ok: true,
      message: 'hola mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }
  
  
  // @SetMetadata('roles',['admin','super-user'])

  @Get('private2')
 // @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }




  @Get('private33')
  @RoleProtected( ValidRolex.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute33(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }




  @Get('private3')
  @RoleProtected(ValidRolex.admin, ValidRolex.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute3(
    @GetUser() user: User
  ) {
    console.log('ingreso a la ruta protegida 3');
    return {
      ok: true,
      user
    }
  }

  


  @Get('privates3')
  @Auth(ValidRolex.admin)
  privateRoutes3(
    @GetUser() user: User
  ) {
    console.log('ingreso a la ruta protegida 3');
    return {
      ok: true,
      user
    }
  }



}
