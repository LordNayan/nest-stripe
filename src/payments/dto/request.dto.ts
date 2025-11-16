import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsObject } from 'class-validator';

export class CreateCheckoutSessionRequestDto {
    @ApiProperty({ example: 'userId123' })
    @IsString()
    userId: string;

    @ApiProperty({ example: 'basic' })
    @IsString()
    planId: string;

    @ApiProperty({ example: 'payment' })
    @IsString()
    mode: string;

    @ApiProperty({ example: 'https://example.com/success' })
    @IsString()
    success_url: string;

    @ApiProperty({ example: 'https://example.com/cancel' })
    @IsString()
    cancel_url: string;

    @ApiProperty({ example: { userId: 'userId123', planId: 'basic' } })
    @IsObject()
    metadata: any;
}

export class WebhookEventRequestDto {
    @ApiProperty({ example: 'checkout.session.completed' })
    @IsString()
    type: string;

    @ApiProperty({ example: { object: { id: 'cs_test', metadata: { userId: 'userId123', planId: 'basic' } } } })
    @IsObject()
    data: any;
}
