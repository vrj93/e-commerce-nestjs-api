import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as twilio from 'twilio';
import encrypt from './utils/encryption';
import decrypt from './utils/decryption';

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
    const accountSid: string = process.env.TWILIO_ACCOUNT_SID;
    const authToken: string = process.env.TWILIO_AUTH_TOKEN;

    const client: twilio.Twilio = twilio(accountSid, authToken);

    // Random Six digit code for OTP
    const randomNum: number = Math.floor(Math.random() * 1000000);

    // Ensure the number always has 6 digits
    const code: string = randomNum.toString().padStart(6, '0');
    return new Promise(async (resolve, reject) => {
      try {
        const message = await client.messages.create({
          body: `OTP for verifying the phone is ${code}`,
          from: process.env.TWILIO_PHONE_FROM,
          to: process.env.TWILIO_PHONE_TO,
        });

        if (message.sid) {
          req.otp = code;

          const password = req.password;
          delete req.password;
          const encryptObj = await encrypt(password);
          console.log(encryptObj);
          req.password = encryptObj.password;
          req.iv_code = encryptObj.iv_code;
          await this.userRepository.upsert(req, ['phone']);
          const res: object = {
            id: req.id,
            name: req.name,
            phone: req.phone,
          };
          resolve(res); // Return phone number on success
        } else {
          reject(new Error('Failed to send OTP message'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async verifyOTP(req: any): Promise<any> {
    const id = req.id;
    const phone = req.phone;
    const email = req.email;
    const reqOTP = req.otp;
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return {
        flag: false,
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }

    let res: any;

    if (reqOTP == user.otp) {
      if (phone) {
        await this.userRepository.update({ id }, { is_phone: true });
      } else if (email) {
        await this.userRepository.update({ id }, { is_email: true });
      }

      res = {
        flag: true,
        status: HttpStatus.OK,
        msg: 'Verified successfully!',
      };
    } else {
      res = {
        flag: false,
        status: HttpStatus.BAD_REQUEST,
        msg: 'Verification failed!',
      };
    }

    return res;
  }
  async login(req: any): Promise<any> {
    let user: any;
    const reqPassword = req.password;

    if (req.phone) {
      user = await this.userRepository.findOneBy({ phone: req.phone });
    } else if (req.email) {
      user = await this.userRepository.findOneBy({ email: req.email });
    }
    const password = (await decrypt(user.password, user.iv_code)).toString();

    if (reqPassword === password) {
      return 'User is authenticated';
    } else {
      return 'Wrong Credentials!';
    }
  }
}
