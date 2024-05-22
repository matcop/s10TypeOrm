import { SetMetadata } from '@nestjs/common';
// import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { ValidRolex } from 'src/auth/interfaces/valid-rolex';

export const META_ROLES = 'roles';
// console.log(ValidRolex);

export const RoleProtected = (...args: ValidRolex[]) => {
    // console.log('role protected decorator');
    return SetMetadata(META_ROLES, args);
}
