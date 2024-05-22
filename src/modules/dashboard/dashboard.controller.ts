import { Controller, Get, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Response } from 'express';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('product-by-category')
  async productByCategory(@Res() res: Response): Promise<any> {
    const serviceRes = await this.dashboardService.getProductByCategory();
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('product-by-brand')
  async productByBrand(@Res() res: Response): Promise<any> {
    const serviceRes = await this.dashboardService.getProductByBrand();
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('location')
  async getGeoLocation(@Res() res: Response): Promise<any> {
    const serviceRes = await this.dashboardService.getGeoLocation();
    res.status(serviceRes.status).json(serviceRes);
  }
}
