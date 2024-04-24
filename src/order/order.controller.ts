import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ManageOrderDto } from '../dto/manage-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('manage')
  async manageOrder(@Body() manageOrderReq: ManageOrderDto): Promise<any> {
    return this.orderService.manageOrder(manageOrderReq);
  }
}
