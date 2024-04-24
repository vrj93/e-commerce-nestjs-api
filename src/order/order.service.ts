import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async manageOrder(req: any): Promise<any> {
    if (req.id) {
      if (req.addressId) {
        const order = await this.orderRepository.update(
          { id: req.id },
          { address: req.addressId },
        );
        return {
          flag: true,
          status: HttpStatus.CREATED,
          msg: 'Order Updated',
          data: order,
        };
      } else if (req.paymentId) {
        const order = await this.orderRepository.update(
          { id: req.id },
          { payment: req.paymentId },
        );
        return {
          flag: true,
          status: HttpStatus.CREATED,
          msg: 'Order Updated',
          data: order,
        };
      }
    } else {
      const randomNum: number = Math.floor(Math.random() * 10000000000);
      const code: any = randomNum.toString().padStart(10, '0');

      req.orderId = `OR${code}`;
      const createdOrder = await this.orderRepository.save(req);

      const orderObj = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.products', 'product')
        .where('order.id = :id', { id: createdOrder.id })
        .getOne();

      for (const productId of req.products) {
        const product = new Product();
        product.id = productId;
        orderObj.products = [...orderObj.products, product];
      }

      const order = await this.orderRepository.save(orderObj);

      return {
        flag: true,
        status: HttpStatus.CREATED,
        msg: 'Order Created',
        data: order,
      };
    }
  }
}
