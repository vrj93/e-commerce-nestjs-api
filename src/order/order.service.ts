import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}
}
