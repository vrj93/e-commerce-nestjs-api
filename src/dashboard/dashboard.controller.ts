import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('product-by-category')
  productByCategory(): any {
    return this.dashboardService.getProductByCategory();
  }

  @Get('product-by-brand')
  productByBrand(): any {
    return this.dashboardService.getProductByBrand();
  }

  @Get('location')
  getGeoLocation(): any {
    return this.dashboardService.getGeoLocation();
  }
}
