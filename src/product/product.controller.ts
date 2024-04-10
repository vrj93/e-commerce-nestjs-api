import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from '../dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('filter')
  filter(@Body() productReq: ProductDto): any {
    return this.productService.filter(productReq);
  }
}
