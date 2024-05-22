import { SetMetadata } from '@nestjs/common';
import { ValidRolex } from 'src/auth/interfaces';


export const META_ROLES ='roles';

export const RolProtectedx = (...args: ValidRolex[]) => {
    return SetMetadata(META_ROLES, args);
}
