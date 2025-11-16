import { ApiProperty } from '@nestjs/swagger';

export class PlanDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    price: number;
}

export class PlansSuccessResponseDto {
    @ApiProperty({ default: true })
    success: boolean;

    @ApiProperty({ type: [PlanDto] })
    data: PlanDto[];

    @ApiProperty({ required: false })
    message?: string;
}

export class PlansErrorResponseDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty()
    error: string;

    @ApiProperty({ required: false })
    details?: any;
}
