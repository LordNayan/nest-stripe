import { INestApplication, Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

export async function createDefaultAdminUser(app: INestApplication) {
    const userModel = app.get(getModelToken('User'));
    const adminEmail = 'admin@stripe.local';
    const adminPassword = 'admin123';
    let adminUser = await userModel.findOne({ email: adminEmail });
    if (!adminUser) {
        const hash = await bcrypt.hash(adminPassword, 10);
        adminUser = await userModel.create({
            email: adminEmail,
            password: hash,
            name: 'Admin',
            role: 'admin',
        });
        Logger.log(`Default admin user created:`, 'NestApplication');
    } else {
        Logger.log(`Admin user already exists: ${adminEmail}`, 'NestApplication');
    }
}
