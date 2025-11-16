import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './subscription.schema';

@Injectable()
export class SubscriptionService {
    constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>) { }

    async createSubscription(data: Partial<Subscription>) {
        return this.subscriptionModel.create(data);
    }

    async findAllSubscriptions() {
        return this.subscriptionModel.find().sort({ createdAt: -1 });
    }

    async findLatestActiveSubscription(userId: string) {
        return this.subscriptionModel.findOne({ userId, status: 'active' }).sort({ createdAt: -1 });
    }

    async cancelLatestActiveSubscription(userId: string) {
        const subscription = await this.findLatestActiveSubscription(userId);
        if (!subscription) return false;
        subscription.status = 'cancelled';
        await subscription.save();
        return true;
    }
}
