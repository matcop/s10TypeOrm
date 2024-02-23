import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, {message:'debe contener mas de 6 digitos'})
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: ' password debe tener una letra Mayuscula, minuscula y un #numero'
    })
    password: string;

    @IsString()
    @MinLength(5)
    fullName: string;
}
