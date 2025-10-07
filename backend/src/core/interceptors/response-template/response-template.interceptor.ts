import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const STATUS_MESSAGES = {
  [HttpStatus.OK]: 'Success',
  [HttpStatus.CREATED]: 'Created',
  [HttpStatus.NO_CONTENT]: 'No Content',
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
} as const;

@Injectable()
export class ResponseTemplateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    return next.handle().pipe(
      map((data): any => {
        const message =
          data?.message || STATUS_MESSAGES[response.statusCode] || 'Success';
        const success = response.statusCode < HttpStatus.BAD_REQUEST;

        return {
          statusCode: response.statusCode,
          message,
          success,
          data: data === undefined ? null : data,
        };
      }),
      catchError((error) => {
        // For exceptions, extract the status and error details
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        // Set the correct HTTP status code in the response
        response.status(statusCode);

        const errorResponse =
          error instanceof HttpException
            ? error.getResponse()
            : { message: error.message || 'Internal Server Error' };

        const message =
          typeof errorResponse === 'object' && (errorResponse as any).message
            ? (errorResponse as any)?.message
            : STATUS_MESSAGES[statusCode] || 'Error';

        // Wrap the response object in an observable using 'of'
        return of({
          statusCode,
          message,
          success: false,
          data: null,
          error:
            typeof errorResponse === 'object'
              ? errorResponse
              : { message: errorResponse },
        });
      }),
    );
  }
}
