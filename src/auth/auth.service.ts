import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async signup(email: string, password: string, name: string) {
        const existing = await this.userModel.findOne({ email });
        if (existing) throw new BadRequestException('User already exists');
        const hash = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({ email, password: hash, name });
        return this.createToken(user);
    }

    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        return this.createToken(user);
    }

    createToken(user: User) {
        return {
            token: this.jwtService.sign({ sub: user._id, email: user.email, name: user.name }),
            user: { id: user._id, email: user.email, name: user.name },
        };
    }
}
