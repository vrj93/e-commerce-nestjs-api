import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from '../../entity/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../entity/category.entity';
import { Brand } from '../../entity/brand.entity';
import { Color } from '../../entity/color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Brand, Color])],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
