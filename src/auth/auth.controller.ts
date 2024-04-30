import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RowHeaders } from './decorators/row-headers.decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

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

  @Get('private2')
  @SetMetadata('roles',['admin','super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }


}
