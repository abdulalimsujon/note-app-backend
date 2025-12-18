import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/payment.dto';

@ApiTags('payment')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('/payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process a payment' })
  @ApiBody({ type: CreatePaymentDto, description: 'Payment details' })
  @ApiResponse({
    status: 200,
    description: 'Payment processed successfully',
    schema: {
      example: {
        message: 'Payment processed and event emitted successfully',
        amount: 100,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid payment data' })
  async processPayment(@Body() data: CreatePaymentDto): Promise<any> {
    return this.paymentService.processPayment(data);
  }
}
