import { Injectable } from '@nestjs/common';

export type Plan = {
  id: string;
  name: string;
  price: number;
};

@Injectable()
export class PlansService {
  private readonly plans: Plan[] = [
    { id: 'basic', name: 'Basic', price: 500 },
    { id: 'standard', name: 'Standard', price: 1500 },
    { id: 'premium', name: 'Premium', price: 3000 },
  ];

  getPlans(): Plan[] {
    return this.plans;
  }
}
