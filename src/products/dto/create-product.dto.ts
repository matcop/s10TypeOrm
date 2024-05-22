import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, IsIn } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'nombre del producto',
        nullable: false,
        minLength:1
        
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?: number;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty()
    @IsIn(['men', 'woman', 'kid', 'unisex'])
    gender: string;

    @ApiProperty()
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags:string[]


    @ApiProperty()
    @IsString({each:true})
    @IsArray()
    // @IsOptional()
    images?: string[];


}
