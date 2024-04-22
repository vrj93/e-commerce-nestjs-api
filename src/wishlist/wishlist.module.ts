import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [UserModule, ProductModule],
  providers: [WishlistService],
  controllers: [WishlistController],
})
export class WishlistModule {}
