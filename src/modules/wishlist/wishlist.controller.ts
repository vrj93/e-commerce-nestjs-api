import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AddToWishlistDto } from '../../dto/add-to-wishlist.dto';
import { WishlistService } from './wishlist.service';
import { Response } from 'express';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add')
  async addToWishlist(
    @Body() addToWishListReq: AddToWishlistDto,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes =
      await this.wishlistService.addToWishlist(addToWishListReq);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('user/:id')
  async getWishlist(@Param() params: any, @Res() res: Response): Promise<any> {
    const serviceRes = await this.wishlistService.getWishlist(params.id);
    res.status(serviceRes.status).json(serviceRes);
  }
}
