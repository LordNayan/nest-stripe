import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class SignupRequestDto {
    @ApiProperty({ format: 'email', example: 'john.doe@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongpassword123' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class LoginRequestDto {
    @ApiProperty({ format: 'email', example: 'john.doe@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongpassword123' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
