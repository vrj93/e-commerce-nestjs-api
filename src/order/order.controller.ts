import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ManageOrderDto } from '../dto/manage-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('manage')
  async manageOrder(@Body() manageOrderReq: ManageOrderDto): Promise<any> {
    return this.orderService.manageOrder(manageOrderReq);
  }

  @Get('user/:id')
  async getOrder(@Param() params: any): Promise<any> {
    return this.orderService.getOrder(params.id);
  }
}
