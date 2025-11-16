import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'supersecret',
            signOptions: { expiresIn: '1d' },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
