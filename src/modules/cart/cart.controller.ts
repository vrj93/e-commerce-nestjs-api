import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from '../../dto/add-to-cart.dto';
import { Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Body() addToCartReq: AddToCartDto,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.cartService.addToCart(addToCartReq);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('user/:id')
  async getCart(@Param() params: any, @Res() res: Response): Promise<any> {
    const serviceRes = await this.cartService.getCart(params.id);
    res.status(serviceRes.status).json(serviceRes);
  }
}
