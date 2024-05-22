import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/rol-protectedx/rol-protectedx.decorator';
// import { META_ROLES } from 'src/auth/decorators/role-protectedx/role-protectedx.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
    console.log({ validRoles });

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;
    // console.log( validRoles.length() );


    const req = context.switchToHttp().getRequest();
    const user = req.user as User;


    if (!user)
      throw new BadRequestException('rol de usuario no encontrado');

    console.log({ userRoles: user.roles });

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `Usuario prohibido, ${user.fullName} nesecita estar validado en algun role [${validRoles}]`
    );

    // console.log({userRoles: user.roles});
    // console.log('paso por   ...User role Guards');
    // console.log({ validRoles });
    // return true;
  }
}
