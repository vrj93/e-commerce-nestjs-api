import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param() params: any): string {
    return this.userService.getUser(params.id);
  }
  @Post('create')
  createUser(@Body() createUserReq: CreateUserDto): any {
    return createUserReq;
  }
}
