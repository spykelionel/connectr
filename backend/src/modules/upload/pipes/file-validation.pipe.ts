import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

export interface FileValidationOptions {
  maxSize?: number;
  allowedMimeTypes?: string[];
  required?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly defaultOptions: FileValidationOptions = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ],
    required: true,
  };

  constructor(private options: FileValidationOptions = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value && this.options.required) {
      throw new BadRequestException('File is required');
    }

    if (!value) {
      return value;
    }

    this.validateFile(value);
    return value;
  }

  private validateFile(file: Express.Multer.File) {
    // Check file size
    if (file.size > this.options.maxSize) {
      throw new BadRequestException(
        `File size ${file.size} exceeds maximum allowed size of ${this.options.maxSize} bytes`,
      );
    }

    // Check MIME type
    if (!this.options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.options.allowedMimeTypes.join(', ')}`,
      );
    }

    // Check if file has content
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File appears to be empty');
    }
  }
}

// Predefined validation pipes for common use cases
export const ProfileImageValidationPipe = new FileValidationPipe({
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
});

export const PostImageValidationPipe = new FileValidationPipe({
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
});

export const NetworkImageValidationPipe = new FileValidationPipe({
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
});
