import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  stripeSubscriptionId?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
