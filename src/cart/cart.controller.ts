import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() addToCartReq: AddToCartDto): Promise<any> {
    return this.cartService.addToCart(addToCartReq);
  }

  @Get('user/:id')
  async getCart(@Param() params: any): Promise<any> {
    return this.cartService.getCart(params.id);
  }
}
