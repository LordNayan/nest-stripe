import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthSuccessResponseDto, AuthErrorResponseDto } from './dto/response.dto';
import { SignupRequestDto, LoginRequestDto } from './dto/request.dto';
import { AuthUserExistsErrorDto, AuthUnauthorizedErrorDto } from './dto/error.dto';
import { BadRequestException } from '@nestjs/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @ApiResponse({ status: 200, type: AuthSuccessResponseDto })
    @ApiResponse({ status: 400, type: AuthUserExistsErrorDto })
    @ApiBody({ type: SignupRequestDto })
    async signup(@Body() body: SignupRequestDto) {
        const result = await this.authService.signup(body.email, body.password, body.name);
        if (!result || !result.token) throw new BadRequestException('Signup failed');
        return result;
    }

    @Post('login')
    @ApiResponse({ status: 200, type: AuthSuccessResponseDto })
    @ApiResponse({ status: 401, type: AuthUnauthorizedErrorDto })
    @ApiBody({ type: LoginRequestDto })
    async login(@Body() body: LoginRequestDto) {
        const result = await this.authService.login(body.email, body.password);
        if (!result || !result.token) throw new BadRequestException('Login failed');
        return result;
    }
}
