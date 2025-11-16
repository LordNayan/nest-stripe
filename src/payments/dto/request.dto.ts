import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsObject } from 'class-validator';

export class CreateCheckoutSessionRequestDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    planId: string;

    @ApiProperty({ type: 'array', items: { type: 'object' } })
    @IsArray()
    line_items: any[];

    @ApiProperty()
    @IsString()
    mode: string;

    @ApiProperty()
    @IsString()
    success_url: string;

    @ApiProperty()
    @IsString()
    cancel_url: string;

    @ApiProperty()
    @IsObject()
    metadata: any;
}

export class WebhookEventRequestDto {
    @ApiProperty()
    @IsString()
    type: string;

    @ApiProperty()
    @IsObject()
    data: any;
}
