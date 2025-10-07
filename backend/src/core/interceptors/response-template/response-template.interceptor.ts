import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Optional,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseTemplateOptions {
  statusCode: number;
  message: string;
}

@Injectable()
export class ResponseTemplateInterceptor implements NestInterceptor {
  constructor(@Optional() private readonly options?: ResponseTemplateOptions) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { statusCode = 200, message = 'Success' } = this.options || {};

    return next.handle().pipe(
      map((data): any => ({
        statusCode,
        message,
        data,
      })),
    );
  }
}
