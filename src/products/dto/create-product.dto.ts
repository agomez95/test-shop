import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    
    @ApiProperty({
        description: 'Product Title - unique',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'Product Price',
        nullable: false,
        default: 0
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Product Description',
        nullable: true
    })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({
        description: 'Product Slug - unique',
        nullable: true,
        minLength: 1
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Product Stock',
        nullable: false,
        default: 0
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Product Sizes',
        nullable: false,
        isArray: true,
    })
    @IsString({each:true}) //each para cada elemento
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'Product Gender',
        nullable: false,
        enum: ['men','women','kid','unisex']
    })
    @IsIn(['men','women','kid','unisex'])
    gender: string;

    @ApiProperty({
        description: 'Product Tags',
        nullable: false,
        isArray: true,
    })
    @IsString({each:true}) //each para cada elemento
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        description: 'Product Images',
        nullable: true,
        minLength: 1
    })
    @IsString({each:true}) 
    @IsArray()
    @IsOptional()
    images?: string[];
}
