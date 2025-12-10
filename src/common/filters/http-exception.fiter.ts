import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Handle known HttpExceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as any;

        if (Array.isArray(resp.message)) {
          // Handle validation error messages (array of strings)
          message = resp.message.join(', ');
        } else if (typeof resp.message === 'string') {
          message = resp.message;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    }
    // Handle standard JavaScript Errors (e.g. throw new Error())
    else if (exception instanceof Error) {
      message = exception.message;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    // Handle custom exceptions (objects with message and/or status)
    else if (
      typeof exception === 'object' &&
      exception !== null &&
      ('message' in exception || 'status' in exception)
    ) {
      const ex = exception as any;

      if (typeof ex.status === 'number') {
        status = ex.status;
      }

      if (typeof ex.message === 'string') {
        message = ex.message;
      } else if (Array.isArray(ex.message)) {
        message = ex.message.join(', ');
      }
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      success: false,
      message,
    });
  }
}