import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionNotFoundErrorDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty({ default: 'No active subscription found' })
    error: string;
}

export class SubscriptionUnauthorizedErrorDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty({ default: 'Unauthorized' })
    error: string;
}
