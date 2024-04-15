import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import encrypt from '../utils/encryption';
import decrypt from '../utils/decryption';
import { JwtService } from '@nestjs/jwt';
import sendOTP from '../utils/sendOTP';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(req: any): Promise<any> {
    const otpObj = await sendOTP();

    if (otpObj.message.sid) {
      req.otp = otpObj.code;

      const password = req.password;
      delete req.password;
      const encryptObj = await encrypt(password);

      req.password = encryptObj.password;
      req.iv_code = encryptObj.iv_code;

      await this.userRepository.upsert(req, ['phone']);

      return {
        id: req.id,
        name: req.name,
        phone: req.phone,
      };
    } else {
      throw new Error('Failed to send OTP message');
    }
  }

  async sendOTP(id: number): Promise<any> {
    const otpObj: any = await sendOTP();
    if (otpObj.message.sid) {
      await this.userRepository.update({ id }, { otp: otpObj.code });
    }
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
      msg: 'User is authenticated',
      access_token: access_token,
    };
  }

  async getUser(id: any): Promise<any> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.phone',
        'user.email',
        'user.is_phone',
        'user.is_email',
      ])
      .where('user.id = :id', { id })
      .getOne();
  }

  async manageUser(req: any, userId: any): Promise<any> {
    const user: any = await this.userRepository.findOneBy({ id: userId });
    let reqObj: object = {};

    if (req.name && req.name != user.name) {
      reqObj = { ...reqObj, ...{ name: req.name } };
    }

    if (req.phone && req.phone != user.phone) {
      reqObj = { ...reqObj, ...{ phone: req.phone, is_phone: false } };
    }

    if (req.email && req.email != user.email) {
      reqObj = { ...reqObj, ...{ email: req.email, is_email: false } };
    }

    if (req.password) {
      const encryptObj = await encrypt(req.password);
      reqObj = {
        ...reqObj,
        ...{ password: encryptObj.password, iv_code: encryptObj.iv_code },
      };
    }

    await this.userRepository.update({ id: userId }, reqObj);

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Record updated successfully!',
    };
  }
}
