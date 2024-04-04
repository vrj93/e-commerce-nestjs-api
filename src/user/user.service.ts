import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as twilio from 'twilio';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  getUser(userId: any): string {
    return `This is user ${userId}`;
  }
  sendOTP(req: any): any {
    const accountSid: string = process.env.TWILIO_ACCOUNT_SID;;
    const authToken: string = process.env.TWILIO_AUTH_TOKEN;

    const client: twilio.Twilio = twilio(accountSid, authToken);

    // Random Six digit code for OTP
    const randomNum: number = Math.floor(Math.random() * 1000000);

    // Ensure the number always has 6 digits
    const code: string = randomNum.toString().padStart(6, '0');
    client.messages
      .create({
        body: `OTP for verifying the phone is ${code}`,
        from: process.env.TWILIO_PHONE_FROM,
        to: process.env.TWILIO_PHONE_TO,
      })
      .then((message: any) => console.log(message));
  }
}
