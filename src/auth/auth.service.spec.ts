import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';

describe('AuthService', () => {
    let service: AuthService;
    let userModel: any;
    let jwtService: any;

    beforeEach(async () => {
        userModel = { findOne: jest.fn(), create: jest.fn() };
        jwtService = { sign: jest.fn().mockReturnValue('token') };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getModelToken(User.name), useValue: userModel },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();
        service = module.get<AuthService>(AuthService);
    });

    it('should create a new user', async () => {
        userModel.findOne.mockResolvedValue(null);
        userModel.create.mockResolvedValue({ _id: 'id', email: 'test@test.com', name: 'Test', password: 'hashed' });
        const result = await service.signup('test@test.com', 'pass', 'Test');
        expect(result.token).toBe('token');
        expect(result.user.email).toBe('test@test.com');
    });

    it('should throw if user exists', async () => {
        userModel.findOne.mockResolvedValue({ email: 'test@test.com' });
        await expect(service.signup('test@test.com', 'pass', 'Test')).rejects.toThrow();
    });

    it('should login with valid credentials', async () => {
        userModel.findOne.mockResolvedValue({ _id: 'id', email: 'test@test.com', name: 'Test', password: '$2b$10$hash' });
        jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);
        const result = await service.login('test@test.com', 'pass');
        expect(result.token).toBe('token');
    });

    it('should throw for invalid credentials', async () => {
        userModel.findOne.mockResolvedValue(null);
        await expect(service.login('test@test.com', 'pass')).rejects.toThrow();
    });
});
