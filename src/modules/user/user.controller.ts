import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { VerifyOTPDto } from '../../dto/verify-otp.dto';
import { LoginDto } from '../../dto/login.dto';
import { ManageUserDto } from '../../dto/manage-user.dto';
import { ManageAddressDto } from '../../dto/manage-address.dto';
import { Response } from 'express';
import { SearchPhoneDto } from 'src/dto/search-phone.dto';
import { SearchEmailDto } from 'src/dto/search-email.dto';
import { CreateAccountDto } from 'src/dto/create-account.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search-phone/:phone')
  async searchPhone(
    @Param() params: SearchPhoneDto,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.userService.searchPhone(params.phone);
    res
      .status(serviceRes.flag ? HttpStatus.BAD_REQUEST : HttpStatus.OK)
      .json(serviceRes);
  }

  @Get('search-email/:email')
  async searchEmail(
    @Param() params: SearchEmailDto,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.userService.searchEmail(params.email);
    res
      .status(serviceRes.flag ? HttpStatus.BAD_REQUEST : HttpStatus.OK)
      .json(serviceRes);
  }

  @Post('create-account')
  async createAccount(
    @Body() createAccountReq: CreateAccountDto,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.userService.createAccount(createAccountReq);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Put('update-phone-otp/:id')
  async updatePhoneOTP(
    @Param() params: any,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.userService.updatePhoneOTP(params.id);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Put('send-otp-mail/:id')
  async sendOTPMail(@Param() params: any, @Res() res: Response): Promise<any> {
    const serviceRes = await this.userService.sendOTPMail(params.id);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Post('verify-otp')
  async verifyOTP(
    @Body() verifyOTPReq: VerifyOTPDto,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.userService.verifyOTP(verifyOTPReq);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Post('login')
  async login(@Body() loginReq: LoginDto, @Res() res: Response): Promise<any> {
    const serviceRes = await this.userService.login(loginReq);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('find/:id')
  async getUser(@Param() params: any, @Res() res: Response): Promise<any> {
    const serviceRes = await this.userService.getUser(params.id);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Put('manage/:id')
  async manageUser(
    @Body() manageUserReq: ManageUserDto,
    @Param() params: any,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.userService.manageUser(
      manageUserReq,
      params.id,
    );
    res.status(serviceRes.status).json(serviceRes);
  }

  @Post('manage/address/:id?')
  async manageAddress(
    @Body() manageAddressReq: ManageAddressDto,
    @Param() params: any,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.userService.manageAddress(
      manageAddressReq,
      params.id,
    );
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('get-address/:id')
  async getAddressByUser(
    @Param() params: any,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.userService.getAddressByUser(params.id);
    res.status(serviceRes.status).json(serviceRes);
  }
}
