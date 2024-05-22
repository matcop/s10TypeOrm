import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { } from './dto/create-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'; //importamos todo de bcrypt
import { LoginUserDto, CreateUserDto } from './dto';
import { emit } from 'process';
//import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtPayload } from './interfaces/index';

import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {

    try {
      //desestructuramos lo que ingresa en el DTO
      const { password, ...userData } = createUserDto;



      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });




      await this.userRepository.save(user)
      delete user.password;
      delete user.isActive;
      // delete user.id;


      return {
        ...user,
        // token: this.getJwtToken({id:user.id, email: user.email })
        token: this.getJwtToken({ id: user.id })

      }


    } catch (error) {
      this.handleDBError(error)
      // console.log(error);
    }



  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }



  //---------LOGIN------------------
  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    //  const user2 = await this.userRepository.findOneBy({email});  
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });



    if (!user)
      throw new UnauthorizedException('Credenciales no son validas (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales no son validas (password)');




    // console.log(length(user));
    const mail_parcial = this.hideEmail(user.email);
    // delete user.id

    //return user;
    // console.log({ user });

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
      "email-parcial": mail_parcial
    };

    // si las credenciales son correctas, se envia eltoken 
    // ademas se le enviaria un msg al correo electronico, con un numero generado  4 numeros como si fuese un otp.
    // se abriria otra pantalla otp_screen para el numero generado



  }

  //  private hideEmail(email: string): string {
  //     const parts = email.split('@');
  //     const hiddenPart = parts[0].slice(1, -1).replace(/./g, '*');
  //     return `${parts[0][0]}${hiddenPart}@${parts[1]}`;
  //   }

  // private hideEmail(email: string): string {
  //   const parts = email.split('@');
  //   const domain = parts[1];

  //   if (commonDomains.includes(domain)) {
  //     // Ocultar parte del nombre de usuario para dominios comunes
  //     const hiddenPart = parts[0].slice(1, -1).replace(/./g, '*');
  //     return `${parts[0][0]}${hiddenPart}@${parts[1]}`;
  //   } else {
  //     // Ocultar solo el primer caracter del nombre de usuario para dominios no comunes
  //     return `${parts[0][0]}*@${parts[1]}`;
  //   }

  // }





  hideEmail(email: string): string {
    const parts = email.split('@');
    const domain = parts[1];

    if (commonDomains.includes(domain)) {
      // Ocultar parte del nombre de usuario para dominios comunes
      const hiddenPart = parts[0].slice(1, -1).replace(/./g, '*');
      return `${parts[0][0]}${hiddenPart}@${domain.charAt(0)}${domain.slice(-1)}`;
    } else {
      // Ocultar solo el primer caracter del nombre de usuario para dominios no comunes
      return `${parts[0][0]}*@${parts[1]}`;
    }
  }


  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }


  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  private handleDBError(error: any): never { // no devuelve ningun valor
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Por favor  verifica los registros del servidor - 2024')
  }


}

const commonDomains = [
  'gmail.com',
  'hotmail.com',
  'yahoo.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'zoho.com',
  'yandex.com',
  'protonmail.com',
  'dot.com',
];