import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor(private configService: ConfigService) {
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

    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
    });
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      Logger.log('✅ Kafka producer connected successfully');
    } catch (error) {
      Logger.error('❌ Failed to connect Kafka producer', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      Logger.log('⛔ Kafka producer disconnected');
    } catch (error) {
      Logger.error('Error disconnecting Kafka producer', error);
    }
  }

  async send(topic: string, message: any, key?: string): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: key || Date.now().toString(),
            value: JSON.stringify(message),
            timestamp: Date.now().toString(),
          },
        ],
      });

      Logger.log(`📤 Message sent to topic '${topic}'`);
    } catch (error) {
      Logger.error(`Failed to send message to topic '${topic}'`, error);
      throw error;
    }
  }
}
