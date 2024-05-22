import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { VerifyOTPDto } from '../../dto/verify-otp.dto';
import { LoginDto } from '../../dto/login.dto';
import { ManageUserDto } from '../../dto/manage-user.dto';
import { ManageAddressDto } from '../../dto/manage-address.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  async createUser(
    @Body() createUserReq: CreateUserDto,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.userService.createUser(createUserReq);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Put('send-otp/:id')
  async sendOTP(@Param() params: any, @Res() res: Response): Promise<any> {
    const serviceRes = await this.userService.sendOTP(params.id);
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

  @Get(':id')
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
