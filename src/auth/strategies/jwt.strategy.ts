import { PassportStrategy } from "@nestjs/passport";
import { Passport, use } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        //este metodo se encargara de validar si el JWt no ha expirado.
        //ademas validara si la firma del jwt coincide con el payload. 
        //ademas ejecutaresmos esto cuando pasen las anteriores 2 validaciones. 

        const { id } = payload;
        const user = await this.userRepository.findOneBy({ id });

        if (!user)
            throw new UnauthorizedException('token not valid...2024 kat... autenticacion no valida')

        if (!user.isActive)
            throw new UnauthorizedException('user is inactive, talk with an admin - llame al 79537750')

        // console.log({ user });


        return user;
    }

}