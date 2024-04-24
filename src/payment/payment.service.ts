import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from '../entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}
}
