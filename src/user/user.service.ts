import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser(userId: any): string {
    return `This is user ${userId}`;
  }
}
