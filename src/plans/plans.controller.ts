import { Controller, Get } from '@nestjs/common';
import { PlansService } from './plans.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PlansSuccessResponseDto, PlansErrorResponseDto } from './dto/response.dto';
import { PlansNotFoundErrorDto } from './dto/error.dto';
import { BadRequestException } from '@nestjs/common';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) { }

  @Get()
  @ApiResponse({ status: 200, type: PlansSuccessResponseDto })
  @ApiResponse({ status: 400, type: PlansNotFoundErrorDto })
  getPlans() {
    const plans = this.plansService.getPlans();
    if (!plans || plans.length === 0) throw new BadRequestException('No plans found');
    return plans;
  }
}
