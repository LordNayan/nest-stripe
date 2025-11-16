import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;
}

export class AuthSuccessResponseDto {
    @ApiProperty({ default: true })
    success: boolean;

    @ApiProperty()
    token: string;

    @ApiProperty({ type: UserDto })
    user: UserDto;
}

export class AuthErrorResponseDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty()
    error: string;

    @ApiProperty({ required: false })
    details?: any;
}
