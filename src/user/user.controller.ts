import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { VerifyOTPDto } from './verify-otp.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param() params: any): string {
    return this.userService.getUser(params.id);
  }
  @Post('send-otp')
  createUser(@Body() createUserReq: CreateUserDto): any {
    return this.userService.sendOTP(createUserReq);
  }

  @Post('verify-otp')
  verifyOTP(@Body() verifyOTPReq: VerifyOTPDto): any {
    return this.userService.verifyOTP(verifyOTPReq);
  }
}
