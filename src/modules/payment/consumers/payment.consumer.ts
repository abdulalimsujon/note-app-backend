import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { PaymentRepository } from '../repository/payment.repositories';

@Injectable()
export class PaymentConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentRepository: PaymentRepository,
  ) {
    this.kafka = new Kafka({
      clientId:
        this.configService.get<string>('kafka.clientId') || 'note-service',
      brokers: this.configService.get<string[]>('kafka.brokers') || [
        'localhost:9092',
      ],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.consumer = this.kafka.consumer({ groupId: 'payment-group' });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      Logger.log('✅ Kafka consumer connected');

      await this.consumer.subscribe({
        topic: 'payment-successful-topic',
        fromBeginning: false,
      });

      await this.consumer.run({
        eachMessage: async ({
          topic,
          partition,
          message,
        }: EachMessagePayload) => {
          try {
            if (!message.value) {
              Logger.warn('⚠️ Message value is null or undefined');
              return;
            }

            const paymentData = JSON.parse(message.value.toString());

            console.log(
              '=======================this is payment data',
              paymentData,
            );
            // Save payment to DB
            const payment = await this.paymentRepository.create(paymentData);
            Logger.log(`💾 Payment saved: ${JSON.stringify(payment)}`);
          } catch (error) {
            Logger.error('❌ Error processing payment message', error);
          }
        },
      });
    } catch (error) {
      Logger.error('❌ Failed to connect Kafka consumer', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.consumer.disconnect();
      Logger.log('⛔ Kafka consumer disconnected');
    } catch (error) {
      Logger.error('Error disconnecting Kafka consumer', error);
    }
  }
}
