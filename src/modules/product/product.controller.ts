import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from '../dto/product.dto';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('filter')
  async filter(
    @Body() productReq: ProductDto,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.productService.filter(productReq);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('category')
  async category(@Res() res: Response): Promise<any> {
    const serviceRes = await this.productService.getCategory();
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('brand')
  async brand(@Res() res: Response): Promise<any> {
    const serviceRes = await this.productService.getBrand();
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('color')
  async color(@Res() res: Response): Promise<any> {
    const serviceRes = await this.productService.getColor();
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get(':id')
  async product(@Param() params: any, @Res() res: Response): Promise<any> {
    const serviceRes = await this.productService.getProduct(params.id);
    res.status(serviceRes.status).json(serviceRes);
  }
}
