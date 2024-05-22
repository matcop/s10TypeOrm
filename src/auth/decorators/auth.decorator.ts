import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles, ValidRolex } from '../interfaces';
import { RolProtectedx } from './rol-protectedx/rol-protectedx.decorator';
import { RoleProtected } from './role-protected/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRolex[]) {
    //console.log('decorador auth', {ValidRolex});
  return applyDecorators(
   
    RolProtectedx(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),



    // RoleProtected(ValidRolex.admin, ValidRolex.superUser),
    // UseGuards(AuthGuard(), UserRoleGuard)
   
  
    //se debe investigar el uso de los ejemplos de la parte inferior
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}