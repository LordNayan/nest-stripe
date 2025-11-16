import { ApiProperty } from '@nestjs/swagger';

export class AuthUserExistsErrorDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty({ default: 'User already exists' })
    error: string;
}

export class AuthUnauthorizedErrorDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty({ default: 'Invalid credentials' })
    error: string;
}
