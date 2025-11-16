import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Subscription } from './subscription.schema';

describe('SubscriptionService', () => {
    let service: SubscriptionService;
    let subscriptionModel: any;

    beforeEach(async () => {
        subscriptionModel = {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubscriptionService,
                { provide: getModelToken(Subscription.name), useValue: subscriptionModel },
            ],
        }).compile();
        service = module.get<SubscriptionService>(SubscriptionService);
    });

    it('should create a subscription', async () => {
        subscriptionModel.create.mockResolvedValue({ userId: 'id', planId: 'plan', status: 'active' });
        const result = await service.createSubscription({ userId: 'id', planId: 'plan', status: 'active' });
        expect(result.status).toBe('active');
    });

    it('should find latest active subscription', async () => {
        subscriptionModel.findOne.mockReturnValue({ sort: jest.fn().mockReturnValue('sub') });
        const result = await service.findLatestActiveSubscription('id');
        expect(result).toBe('sub');
    });

    it('should cancel latest active subscription', async () => {
        const sub = { status: 'active', save: jest.fn() };
        jest.spyOn(service, 'findLatestActiveSubscription').mockResolvedValue(sub as any);
        const result = await service.cancelLatestActiveSubscription('id');
        expect(sub.status).toBe('cancelled');
        expect(result).toBe(true);
    });

    it('should return false if no active subscription', async () => {
        jest.spyOn(service, 'findLatestActiveSubscription').mockResolvedValue(null);
        const result = await service.cancelLatestActiveSubscription('id');
        expect(result).toBe(false);
    });
});
