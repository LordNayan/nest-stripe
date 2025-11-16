
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { checkoutSessionCreateMock } from './mock/checkout-session-create.mock';
import { PaymentStatus } from './enums/payment-status.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionService } from '../subscription/subscription.service';
import { SuccessResponse } from '../common/response';
import { BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SuccessResponseDto } from './dto/response.dto';
import { CreateCheckoutSessionRequestDto, WebhookEventRequestDto } from './dto/request.dto';
import { PaymentWebhookErrorDto, PaymentUnauthorizedErrorDto } from './dto/error.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly subscriptionService: SubscriptionService
    ) { }

    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, type: SuccessResponseDto })
    @ApiResponse({ status: 401, type: PaymentUnauthorizedErrorDto })
    @Post('checkout')
    @ApiBody({ type: CreateCheckoutSessionRequestDto })
    @HttpCode(201)
    async createCheckoutSession(@Body() body: CreateCheckoutSessionRequestDto) {
        // Mocked response for checkout session creation
        return new SuccessResponse({ url: checkoutSessionCreateMock.url, session: checkoutSessionCreateMock }, 'Checkout session created');
    }

    @ApiResponse({ status: 200, type: SuccessResponseDto })
    @ApiResponse({ status: 400, type: PaymentWebhookErrorDto })
    @Post('webhook')
    @ApiBody({ type: WebhookEventRequestDto })
    @HttpCode(200)
    async handleWebhook(@Body() event: WebhookEventRequestDto) {
        // Stripe webhook event handling for stripe-mock
        if (!event) throw new BadRequestException('No event payload received');
        if (event.type === 'checkout.session.completed') {
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
        return new SuccessResponse({ received: true }, 'Webhook processed');
    }
}
