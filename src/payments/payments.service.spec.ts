import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Payment } from './payments.schema';

describe('PaymentsService', () => {
    let service: PaymentsService;
    let paymentModel: any;

    beforeEach(async () => {
        paymentModel = { create: jest.fn() };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentsService,
                { provide: getModelToken(Payment.name), useValue: paymentModel },
            ],
        }).compile();
        service = module.get<PaymentsService>(PaymentsService);
    });

    it('should create a payment', async () => {
        paymentModel.create.mockResolvedValue({ userId: 'id', planId: 'plan', status: 'PAID' });
        const result = await service.createPayment({ userId: 'id', planId: 'plan', status: 'PAID' });
        expect(result.status).toBe('PAID');
    });
});
