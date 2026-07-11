import { randomUUID } from 'node:crypto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse, ValidationErrorDetail } from '../errors/error-response';

// Converts all thrown HTTP errors into the API's predictable error contract.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const { statusCode, message, errors } = this.getExceptionDetails(exception);
    const requestId = request.headers['x-request-id'];
    const body: ErrorResponse = {
      statusCode,
      message,
      traceId: typeof requestId === 'string' ? requestId : randomUUID(),
    };

    if (errors) {
      body.errors = errors;
    }

    response.status(statusCode).json(body);
  }

  private getExceptionDetails(exception: unknown): {
    statusCode: number;
    message: string;
    errors?: ValidationErrorDetail[];
  } {
    if (!(exception instanceof HttpException)) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        statusCode: exception.getStatus(),
        message: response,
      };
    }

    const payload = response as {
      message?: string | string[];
      errors?: ValidationErrorDetail[];
    };
    const message = payload.message ?? 'Request failed';
    const errors = payload.errors;

    return {
      statusCode: exception.getStatus(),
      message: Array.isArray(message) ? message.join(', ') : message,
      ...(Array.isArray(errors) ? { errors } : {}),
    };
  }
}
