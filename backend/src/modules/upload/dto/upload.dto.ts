import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export enum UploadType {
  PROFILE = 'profile',
  POST = 'post',
  COMMENT = 'comment',
  NETWORK = 'network',
  GENERAL = 'general',
}

export enum ImageFormat {
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
  WEBP = 'webp',
  GIF = 'gif',
}

export class UploadFileDto {
  @ApiProperty({
    description: 'Type of upload to categorize the file',
    enum: UploadType,
    example: UploadType.PROFILE,
  })
  @IsEnum(UploadType)
  uploadType: UploadType;

  @ApiProperty({
    description: 'Optional folder name for organization',
    example: 'user-avatars',
    required: false,
  })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiProperty({
    description: 'Optional tags for the uploaded file',
    example: ['avatar', 'profile'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Optional transformation options',
    example: { width: 300, height: 300, crop: 'fill' },
    required: false,
  })
  @IsOptional()
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: ImageFormat;
  };
}

export class UploadResponseDto {
  @ApiProperty({
    description: 'Cloudinary public ID',
    example: 'profile/user123_avatar',
  })
  public_id: string;

  @ApiProperty({
    description: 'Secure URL of the uploaded file',
    example:
      'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profile/user123_avatar.jpg',
  })
  secure_url: string;

  @ApiProperty({
    description: 'File format',
    example: 'jpg',
  })
  format: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 245760,
  })
  bytes: number;

  @ApiProperty({
    description: 'Image width in pixels',
    example: 300,
  })
  width: number;

  @ApiProperty({
    description: 'Image height in pixels',
    example: 300,
  })
  height: number;

  @ApiProperty({
    description: 'Upload timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Upload type used',
    example: 'profile',
  })
  uploadType: UploadType;

  @ApiProperty({
    description: 'Folder where file was stored',
    example: 'user-avatars',
  })
  folder?: string;

  @ApiProperty({
    description: 'Tags associated with the file',
    example: ['avatar', 'profile'],
  })
  tags?: string[];
}

export class BulkUploadResponseDto {
  @ApiProperty({
    description: 'Array of successful uploads',
    type: [UploadResponseDto],
  })
  successful: UploadResponseDto[];

  @ApiProperty({
    description: 'Array of failed uploads with error details',
    example: [
      {
        filename: 'large-image.jpg',
        error: 'File size exceeds limit',
      },
    ],
  })
  failed: Array<{
    filename: string;
    error: string;
  }>;

  @ApiProperty({
    description: 'Total number of files processed',
    example: 5,
  })
  total: number;

  @ApiProperty({
    description: 'Number of successful uploads',
    example: 4,
  })
  successCount: number;

  @ApiProperty({
    description: 'Number of failed uploads',
    example: 1,
  })
  failureCount: number;
}

export class DeleteFileDto {
  @ApiProperty({
    description: 'Cloudinary public ID of the file to delete',
    example: 'profile/user123_avatar',
  })
  @IsString()
  publicId: string;
}

export class DeleteResponseDto {
  @ApiProperty({
    description: 'Deletion result',
    example: 'ok',
  })
  result: string;

  @ApiProperty({
    description: 'Success message',
    example: 'File deleted successfully',
  })
  message: string;
}

export class SimpleUploadDto {
  @ApiProperty({
    description: 'File to upload',
    type: 'string',
    format: 'binary',
  })
  file: any;

  @ApiProperty({
    description: 'Optional folder path for the uploaded file',
    example: 'my-folder',
    required: false,
  })
  @IsOptional()
  @IsString()
  path?: string;
}
