import { ApiProperty } from '@nestjs/swagger';

export class PlansNotFoundErrorDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty({ default: 'No plans found' })
    error: string;
}
