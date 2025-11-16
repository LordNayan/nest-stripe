export class CreateCheckoutSessionDto {
    client_reference_id?: string;
    customer?: string;
    customer_email?: string;
    planId: string;
    mode: 'payment';
    return_url?: string;
    success_url?: string;
    cancel_url?: string;
    currency?: string;
}
