import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('order')
  async createPaymentOrder(
    @Body()
    paymentOrderReq: {
      amount: number;
      currency: string;
      orderId: string;
    },
  ): Promise<any> {
    return this.paymentService.createPaymentOrder(paymentOrderReq);
  }

  @Post('capture')
  async paymentCapture(@Body() paymentCaptureReq: any): Promise<any> {
    return this.paymentService.paymentCapture(paymentCaptureReq);
  }
}
