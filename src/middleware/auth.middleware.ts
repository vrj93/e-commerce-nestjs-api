import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const [type, reqToken] = req.headers['authorization']?.split(' ') ?? [];
    const token = type === 'Bearer' ? reqToken : undefined;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_SECRET}`,
      });
      const userId = payload['sub'];
      const user = await this.userService.userRepository.findOneBy({
        id: userId,
      });
      if (user) {
        next();
      }
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
