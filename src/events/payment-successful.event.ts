import { Injectable } from '@nestjs/common';
import { KafkaService } from 'src/infrastructure/kafka/services/kafka.service';

@Injectable()
export class PaymentSuccessfulEvent {
  constructor(private readonly kakafaService: KafkaService) {}
  async emitPaymentSuccessfulEvent(data: any): Promise<void> {
    const topic = 'payment-successful-topic';

    await this.kakafaService.send(topic, data);
  }
}
