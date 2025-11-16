import { ApiProperty } from '@nestjs/swagger';

export class PaymentWebhookErrorDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty({ default: 'No event payload received' })
    error: string;
}

export class PaymentUnauthorizedErrorDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty({ default: 'Unauthorized' })
    error: string;
}
