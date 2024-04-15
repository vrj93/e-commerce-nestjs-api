import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from '../dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('filter')
  filter(@Body() productReq: ProductDto): any {
    return this.productService.filter(productReq);
  }

  @Get('category')
  category(): any {
    return this.productService.getCategory();
  }

  @Get('brand')
  brand(): any {
    return this.productService.getBrand();
  }

  @Get('color')
  color(): any {
    return this.productService.getColor();
  }

  @Get(':id')
  product(@Param() params: any): any {
    return this.productService.getProduct(params.id);
  }
}
