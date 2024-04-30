import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {


  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get('roles', context.getHandler())

    const req = context.switchToHttp().getRequest();
    const user= req.user as User;

    if(!user)
      throw new BadRequestException('rol de usuario no encontrado');

    console.log({userRoles: user.roles});


    console.log('paso por   ...User role Guards');
    console.log({ validRoles });
    return true;
  }
}
