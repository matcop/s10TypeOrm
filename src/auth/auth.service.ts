import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { } from './dto/create-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'; //importamos todo de bcrypt
import { LoginUserDto, CreateUserDto } from './dto';
import { emit } from 'process';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService:JwtService
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
      // delete user.password;
      // delete user.id;


      return {
        ...user,
        token:this.getJwtToken({email: user.email})
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




  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if (!user)
      throw new UnauthorizedException('Credenciales no son validas (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales no son validas (password)');
    // console.log(length(user));
    // delete user.id
    return {
      ...user,
      token:this.getJwtToken({email: user.email})
    }
  }


private getJwtToken(payload:JwtPayload){
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
