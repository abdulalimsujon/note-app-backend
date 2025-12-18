import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/infrastructure/kafka/kafka.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { PaymentSuccessfulEvent } from 'src/events/payment-successful.event';
import { PaymentRepository } from './repository/payment.repositories';
import { PaymentConsumerService } from './consumers/payment.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    KafkaModule,
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentSuccessfulEvent,
    PaymentRepository,
    PaymentConsumerService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
