import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { VerifyOTPDto } from '../dto/verify-otp.dto';
import { LoginDto } from '../dto/login.dto';
import { ManageUserDto } from '../dto/manage-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  createUser(@Body() createUserReq: CreateUserDto): any {
    return this.userService.createUser(createUserReq);
  }

  @Put('send-otp/:id')
  sendOTP(@Param() params: any): any {
    return this.userService.sendOTP(params.id);
  }

  @Put('send-otp-mail/:id')
  sendOTPMail(@Param() params: any): any {
    return this.userService.sendOTPMail(params.id);
  }

  @Post('verify-otp')
  verifyOTP(@Body() verifyOTPReq: VerifyOTPDto): any {
    return this.userService.verifyOTP(verifyOTPReq);
  }

  @Post('login')
  login(@Body() loginReq: LoginDto): any {
    return this.userService.login(loginReq);
  }
  @Get(':id')
  getUser(@Param() params: any): any {
    return this.userService.getUser(params.id);
  }

  @Put('manage/:id')
  manageUser(@Body() manageUserReq: ManageUserDto, @Param() params: any): any {
    return this.userService.manageUser(manageUserReq, params.id);
  }
}
