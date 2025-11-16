import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = any> {
    @ApiProperty({ default: true })
    success: boolean;

    @ApiProperty()
    data: T;

    @ApiProperty({ required: false })
    message?: string;
}

export class ErrorResponseDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty()
    error: string;

    @ApiProperty({ required: false })
    details?: any;
}
