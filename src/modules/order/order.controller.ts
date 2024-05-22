import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { ManageOrderDto } from '../../dto/manage-order.dto';
import { Response } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('manage')
  async manageOrder(
    @Body() manageOrderReq: ManageOrderDto,
    @Res() res: Response,
  ): Promise<any> {
    const serviceRes = await this.orderService.manageOrder(manageOrderReq);
    res.status(serviceRes.status).json(serviceRes);
  }

  @Get('user/:id')
  async getOrder(@Param() params: any, @Res() res: Response): Promise<any> {
    const serviceRes = await this.orderService.getOrder(params.id);
    res.status(serviceRes.status).json(serviceRes);
  }
}
