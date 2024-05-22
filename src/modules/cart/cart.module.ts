import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [UserModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
