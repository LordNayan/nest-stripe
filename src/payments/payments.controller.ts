
import { Body, Controller, Post, Req, Get, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { checkoutSessionCreateMock } from './mock/checkout-session-create.mock';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { PaymentStatus } from './enums/payment-status.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionService } from '../subscription/subscription.service';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly subscriptionService: SubscriptionService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    async createCheckoutSession(@Body() body: CreateCheckoutSessionDto) {
        // Mocked response for checkout session creation
        return { url: checkoutSessionCreateMock.url, session: checkoutSessionCreateMock };
    }

    @Post('webhook')
    async handleWebhook(@Body() event: any) {
        // Stripe webhook event handling for stripe-mock
        if (event && event.type === 'checkout.session.completed') {
            const session = event.data.object;
            await this.paymentsService.createPayment({
                userId: session.metadata?.userId,
                planId: session.metadata?.planId,
                status: PaymentStatus.PAID,
                stripeSubscriptionId: session.id,
            });
            // Directly create subscription after payment
            await this.subscriptionService.createSubscription({
                userId: session.metadata?.userId,
                planId: session.metadata?.planId,
                status: 'active',
                stripeSubscriptionId: session.id,
            });
        }
        // You can handle other event types here as needed
        return { received: true };
    }
}
