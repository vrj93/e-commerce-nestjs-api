import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from '../entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Razorpay from 'razorpay';
import { createHmac } from 'node:crypto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createPaymentOrder(req: any): Promise<any> {
    const razorpay = new Razorpay({
      key_id: `${process.env.RAZORPAY_KEY_ID}`,
      key_secret: `${process.env.RAZORPAY_KEY_SECRET}`,
    });

    const options = {
      amount: req.amount,
      currency: req.currency,
      receipt: req.orderId,
      payment_capture: 1,
    };

    try {
      const res = await razorpay.orders.create(options);
      return {
        flag: true,
        status: HttpStatus.CREATED,
        msg: 'Payment order created!',
        data: res,
      };
    } catch (err) {
      return {
        flag: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: new Error(err),
      };
    }
  }

  async paymentCapture(req: any): Promise<any> {
    const data = createHmac('sha256', `${process.env.RAZORPAY_KEY_SECRET}`);
    data.update(JSON.stringify(req));
    const digest = data.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
      return req;
    } else {
      return {
        flag: false,
        status: HttpStatus.BAD_REQUEST,
        msg: 'Invalid Signature!',
      };
    }
  }
}
