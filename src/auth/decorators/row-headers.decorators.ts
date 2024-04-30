import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { error } from "console";

export const RowHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {


        const req = ctx.switchToHttp().getRequest();
        const head = req.rawHeaders;

        if (!head)
            throw new InternalServerErrorException('headers no encontrado en la petición')

        return head;

    }



);