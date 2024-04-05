import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('send-otp')
  createUser(@Body() createUserReq: CreateUserDto): any {
    return this.userService.sendOTP(createUserReq);
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
  getUser(@Param() params: any): string {
    return this.userService.getUser(params.id);
  }
}
