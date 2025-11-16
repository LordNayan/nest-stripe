import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subscription extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    planId: string;

    @Prop({ required: true })
    status: string;

    @Prop()
    stripeSubscriptionId?: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
