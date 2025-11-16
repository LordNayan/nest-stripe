import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSubscription(@Req() req) {
        const userId = req.user.userId;
        const subscription = await this.subscriptionService.findLatestActiveSubscription(userId);
        if (!subscription) return { subscription: null };
        return {
            subscription: {
                planId: subscription.planId,
                status: subscription.status,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
            }
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancel')
    async cancelSubscription(@Req() req) {
        const userId = req.user.userId;
        const cancelled = await this.subscriptionService.cancelLatestActiveSubscription(userId);
        if (!cancelled) return { cancelled: false, message: 'No active subscription found.' };
        return { cancelled: true };
    }
}
