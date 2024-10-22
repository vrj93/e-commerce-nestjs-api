import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import { encrypt, decrypt } from './utils/processPassword';
import { JwtService } from '@nestjs/jwt';
import { generateOTP, sendPhoneOTP } from './utils/processOTP';
import { MailerService } from '@nestjs-modules/mailer';
import { Address } from '../../entity/address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async searchPhone(phone: any): Promise<any> {
    const userObj = await this.userRepository.findOneBy({ phone });
    return userObj ? { flag: true } : { flag: false };
  }

  async searchEmail(email: any): Promise<any> {
    const userObj = await this.userRepository.findOneBy({ email });
    return userObj ? { flag: true } : { flag: false };
  }

  async createAccount(req: any): Promise<any> {
    const otp = generateOTP();
    const otpObj = await sendPhoneOTP(req.phone, otp);
    if (otpObj?.MessageId) {
      req.otp = otp;
      const password = req.password;
      delete req.password;
      const encryptObj = await encrypt(password);
      req.password = encryptObj.password;
      req.iv_code = encryptObj.iv_code;

      await this.userRepository.upsert(req, ['phone']);

      return {
        flag: true,
        status: HttpStatus.CREATED,
        msg: 'OTP sent successfully',
        data: {
          id: req.id,
          name: req.name,
          phone: req.phone,
        },
      };
    } else {
      throw new Error('Failed to send OTP message');
    }
  }

  async updatePhoneOTP(id: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });
    const otp = generateOTP();
    const otpObj: any = await sendPhoneOTP(Number(user.phone), otp);
    if (otpObj?.MessageId) {
      await this.userRepository.update({ id }, { otp, is_phone: false });

      return {
        flag: true,
        status: HttpStatus.OK,
        msg: 'OTP sent successfully!',
      };
    } else {
      throw new Error('Failed to send OTP message');
    }
  }

  async sendOTPMail(id: number): Promise<any> {
    const randomNum: number = Math.floor(Math.random() * 1000000);
    const code: any = randomNum.toString().padStart(6, '0');
    const message = `OTP for Email Verification: ${code}`;

    const mailObj = await this.mailService.sendMail({
      from: 'vrj022@gmail.com',
      to: 'vj9322@gmail.com',
      subject: 'OTP for Email verification',
      text: message,
    });

    if (mailObj.messageId) {
      await this.userRepository.update({ id }, { otp: code, is_email: false });
      return {
        flag: true,
        status: HttpStatus.OK,
        msg: 'OTP sent successfully!',
      };
    } else {
      return {
        flag: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: 'Something went wrong!',
      };
    }
  }

  async verifyPhone(req: { id: number; otp: number }): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: req.id });

    if (!user) {
      return {
        flag: false,
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }

    let res: any;

    if (req.otp == user.otp) {
      await this.userRepository.update({ id: req.id }, { is_phone: true });

      res = {
        flag: true,
        status: HttpStatus.OK,
        msg: 'Phone verified successfully!',
      };
    } else {
      res = {
        flag: false,
        status: HttpStatus.BAD_REQUEST,
        msg: 'Phone verification failed!',
      };
    }

    return res;
  }

  async verifyEmail(req: { id: number; otp: number }): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: req.id });

    if (!user) {
      return {
        flag: false,
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }

    let res: any;

    if (req.otp == user.otp) {
      await this.userRepository.update({ id: req.id }, { is_email: true });

      res = {
        flag: true,
        status: HttpStatus.OK,
        msg: 'Email verified successfully!',
      };
    } else {
      res = {
        flag: false,
        status: HttpStatus.BAD_REQUEST,
        msg: 'Email verification failed!',
      };
    }

    return res;
  }

  async login(req: any): Promise<any> {
    let userRes;
    const userReq: any = req.user;
    const reqPassword: string = req.password;

    if (userReq.phone) {
      userRes = await this.userRepository.findOneBy({
        phone: req.user.phone,
        is_phone: true,
      });
    } else if (userReq.email) {
      userRes = await this.userRepository.findOneBy({
        email: req.user,
        is_email: true,
      });
    } else {
      return {
        flag: false,
        status: HttpStatus.BAD_REQUEST,
        msg: 'User is required',
      };
    }

    if (!userRes) {
      return {
        flag: false,
        status: HttpStatus.BAD_REQUEST,
        msg: 'User is not verified',
      };
    }

    const password = (
      await decrypt(userRes.password, userRes.iv_code)
    ).toString();

    if (reqPassword !== password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: userRes.id, username: userRes.phone };
    const accessToken: string = await this.jwtService.signAsync(payload);

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'User is authenticated',
      data: {
        name: userRes.firstName,
        access_token: accessToken,
      },
    };
  }

  async getUser(id: any): Promise<any> {
    const user = await this.userRepository
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

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'User fetched successfully',
      data: user,
    };
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

  async manageAddress(req: any, addressId: any): Promise<any> {
    try {
      if (addressId) {
        await this.addressRepository.update({ id: addressId }, { ...req });
      } else {
        await this.addressRepository.save(req);
      }
      return {
        flag: true,
        status: HttpStatus.CREATED,
        msg: 'Address updated successfully',
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAddressByUser(userId: any): Promise<any> {
    const addressObj = await this.addressRepository
      .createQueryBuilder('address')
      .innerJoin('address.user', 'user')
      .where('user.id = :user', { user: userId })
      .getMany();

    if (addressObj.length >= 1) {
      return {
        flag: true,
        status: HttpStatus.OK,
        msg: 'Address fetched successfully!',
        data: addressObj,
      };
    } else {
      return {
        flag: true,
        status: HttpStatus.OK,
        msg: 'No Address found!',
        data: addressObj,
      };
    }
  }
}
