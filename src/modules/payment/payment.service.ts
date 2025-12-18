import { Injectable } from '@nestjs/common';

import { PaymentRepository } from './repository/payment.repositories';
import { PaymentSuccessfulEvent } from 'src/events/payment-successful.event';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentSuccessfulEvent: PaymentSuccessfulEvent,
  ) {}

  async processPayment(data: any): Promise<any> {
    const result =
      await this.paymentSuccessfulEvent.emitPaymentSuccessfulEvent(data);
    return {
      message: 'Payment processed and event emitted successfully',
      data: result,
    };
  }
}
