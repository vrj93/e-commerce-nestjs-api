import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import * as twilio from 'twilio';
import encrypt from '../utils/encryption';
import decrypt from '../utils/decryption';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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
      user = await this.userRepository.findOneBy({
        phone: req.phone,
        is_phone: true,
      });
    } else if (req.email) {
      user = await this.userRepository.findOneBy({
        email: req.email,
        is_email: true,
      });
    }

    if (!user) {
      return {
        flag: false,
        status: HttpStatus.BAD_REQUEST,
        msg: 'User is not verified',
      };
    }

    const password = (await decrypt(user.password, user.iv_code)).toString();

    if (reqPassword !== password) {
      throw new UnauthorizedException();
    }

    let payload: any;
    if (req.phone) {
      payload = { sub: user.id, username: user.phone };
    } else if (req.email) {
      payload = { sub: user.id, username: user.email };
    }

    const access_token: string = await this.jwtService.signAsync(payload);

    return {
      flag: true,
      status: HttpStatus.OK,
      access_token: access_token,
      msg: 'User is authenticated',
    };
  }
}
