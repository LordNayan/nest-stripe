import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './payments.schema';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment>) { }

  async createPayment(data: Partial<Payment>) {
    return this.paymentModel.create(data);
  }

  async findLatestPaidPayment(userId: string) {
    return this.paymentModel.findOne({ userId, status: 'paid' }).sort({ createdAt: -1 });
  }

  async cancelLatestPaidPayment(userId: string) {
    const payment = await this.findLatestPaidPayment(userId);
    if (!payment) return false;
    payment.status = 'cancelled';
    await payment.save();
    return true;
  }
}
