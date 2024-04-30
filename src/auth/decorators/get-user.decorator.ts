import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { error } from "console";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {


        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user)
            throw new InternalServerErrorException('Usuario no encontrado en la petición')

        return (!data) ? user : user[data];

    }



);