import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddToWishlistDto } from '../dto/add-to-wishlist.dto';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add')
  async addToWishlist(
    @Body() addToWishListReq: AddToWishlistDto,
  ): Promise<any> {
    return this.wishlistService.addToWishlist(addToWishListReq);
  }

  @Get('user/:id')
  async getWishlist(@Param() params: any) {
    return this.wishlistService.getWishlist(params.id);
  }
}
