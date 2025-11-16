
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/global-exception.filter';
import { getModelToken } from '@nestjs/mongoose';

describe('Integration: Full Flow', () => {
  let app: INestApplication;
  let jwt: string;
  let userId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    // Match main.ts global setup
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Clean up test user before running tests
    const userModel = app.get(getModelToken('User'));
    await userModel.deleteOne({ email: 'user@example.com' });
  });

  it('should signup and login', async () => {
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'user@example.com', password: 'pass', name: 'Test User' })
      .expect(201);
    expect(signupRes.body.success).toBe(true);
    expect(signupRes.body.data.token).toBeDefined();
    expect(signupRes.body.data.user).toBeDefined();
    jwt = signupRes.body.data.token;
    userId = signupRes.body.data.user.id;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'pass' })
      .expect(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.token).toBeDefined();
    expect(loginRes.body.data.user).toBeDefined();
  });

  it('should get plans', async () => {
    const res = await request(app.getHttpServer())
      .get('/plans')
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should create checkout session', async () => {
    const res = await request(app.getHttpServer())
      .post('/payments/checkout')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        userId,
        planId: 'basic',
        line_items: [{ price: 'price_123', quantity: 1 }],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        metadata: { userId, planId: 'basic' },
      })
      .expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.url).toBeDefined();
  });

  it('should simulate webhook and create subscription', async () => {
    const res = await request(app.getHttpServer())
      .post('/payments/webhook')
      .send({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test',
            metadata: { userId, planId: 'basic' },
          },
        },
      })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.received).toBe(true);
  });

  it('should get user subscription', async () => {
    const res = await request(app.getHttpServer())
      .get('/subscription')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.subscription).toBeDefined();
  });

  it('should cancel subscription', async () => {
    const res = await request(app.getHttpServer())
      .post('/subscription/cancel')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.cancelled).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
