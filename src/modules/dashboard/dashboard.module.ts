import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entity/product.entity';
import { Category } from '../../entity/category.entity';
import { Brand } from '../../entity/brand.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Brand])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
