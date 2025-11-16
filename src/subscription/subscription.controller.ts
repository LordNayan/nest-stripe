import { Body, Controller, Get, Post, UseGuards, Req, HttpCode } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/response';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/roles.enum';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SuccessResponseDto, ErrorResponseDto } from './dto/response.dto';
import { SubscriptionNotFoundErrorDto, SubscriptionUnauthorizedErrorDto } from './dto/error.dto';

@ApiTags('Subscription')
@ApiBearerAuth()
@Controller('subscription')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiResponse({ status: 200, type: SuccessResponseDto })
    @ApiResponse({ status: 400, type: SubscriptionNotFoundErrorDto })
    @ApiResponse({ status: 401, type: SubscriptionUnauthorizedErrorDto })
    async getSubscription(@Req() req) {
        const userId = req.user.userId;
        const subscription = await this.subscriptionService.findLatestActiveSubscription(userId);
        if (!subscription) throw new BadRequestException('No active subscription found');
        return new SuccessResponse({
            subscription: {
                planId: subscription.planId,
                status: subscription.status,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
            }
        }, 'Active subscription found');
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Get('all')
    @ApiResponse({ status: 200, type: SuccessResponseDto })
    @ApiResponse({ status: 401, type: SubscriptionUnauthorizedErrorDto })
    async getAllSubscriptions() {
        const subscriptions = await this.subscriptionService.findAllSubscriptions();
        return new SuccessResponse(subscriptions, 'All subscriptions fetched');
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancel')
    @ApiResponse({ status: 200, type: SuccessResponseDto })
    @ApiResponse({ status: 400, type: SubscriptionNotFoundErrorDto })
    @ApiResponse({ status: 401, type: SubscriptionUnauthorizedErrorDto })
    @HttpCode(200)
    async cancelSubscription(@Req() req) {
        const userId = req.user.userId;
        const cancelled = await this.subscriptionService.cancelLatestActiveSubscription(userId);
        if (!cancelled) throw new BadRequestException('No active subscription found');
        return new SuccessResponse({ cancelled: true }, 'Subscription cancelled');
    }
}
