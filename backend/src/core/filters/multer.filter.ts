import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.code === 'LIMIT_FILE_SIZE' ? 413 : 400; // 413 Payload Too Large

    response.status(status).json({
      statusCode: status,
      message:
        exception.code === 'LIMIT_FILE_SIZE'
          ? 'File size exceeds the limit of 5MB'
          : 'File upload error',
      error: exception.message,
    });
  }
}
