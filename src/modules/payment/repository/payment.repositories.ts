import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repository/base.repository';
import { Payment, PaymentDocument } from '../schemas/payment.schema';

@Injectable()
export class PaymentRepository extends BaseRepository<PaymentDocument> {
  constructor(
    @InjectModel(Payment.name)
    private readonly NoteModel: Model<PaymentDocument>,
    // It tells NestJS to inject the Mongoose model for the Note schema into this property.
  ) {
    super(NoteModel);
  }
}
