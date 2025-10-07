import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadFileDto, UploadResponseDto, UploadType } from './dto';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private configService: ConfigService) {
    this.initializeCloudinary();
  }

  private initializeCloudinary() {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    uploadDto: UploadFileDto,
  ): Promise<UploadResponseDto> {
    try {
      this.validateFile(file);

      const uploadOptions = this.buildUploadOptions(uploadDto);

      this.logger.log(`Uploading file: ${file.originalname} to Cloudinary`);

      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        uploadOptions,
      );

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at,
        uploadType: uploadDto.uploadType,
        folder: uploadDto.folder,
        tags: uploadDto.tags,
      };
    } catch (error) {
      this.logger.error(`Upload failed for file: ${file.originalname}`, error);
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }
  }

  async uploadFileDirect(file: Express.Multer.File, uploadOptions: any) {
    try {
      this.validateFile(file);

      this.logger.log(`Uploading file: ${file.originalname} to Cloudinary`);

      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        uploadOptions,
      );

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at,
      };
    } catch (error) {
      this.logger.error(`Upload failed for file: ${file.originalname}`, error);
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }
  }

  async uploadFromUrl(
    imageUrl: string,
    uploadDto: UploadFileDto,
  ): Promise<UploadResponseDto> {
    try {
      this.logger.log(`Uploading from URL: ${imageUrl} to Cloudinary`);

      const uploadOptions = this.buildUploadOptions(uploadDto);

      const result = await cloudinary.uploader.upload(imageUrl, uploadOptions);

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at,
        uploadType: uploadDto.uploadType,
        folder: uploadDto.folder,
        tags: uploadDto.tags,
      };
    } catch (error) {
      this.logger.error(`Upload from URL failed: ${imageUrl}`, error);
      throw new InternalServerErrorException(
        `Failed to upload from URL: ${error.message}`,
      );
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    uploadDto: UploadFileDto,
  ) {
    const results = {
      successful: [],
      failed: [],
      total: files.length,
      successCount: 0,
      failureCount: 0,
    };

    for (const file of files) {
      try {
        const uploadResult = await this.uploadFile(file, uploadDto);
        results.successful.push(uploadResult);
        results.successCount++;
      } catch (error) {
        results.failed.push({
          filename: file.originalname,
          error: error.message,
        });
        results.failureCount++;
      }
    }

    return results;
  }

  async deleteFile(
    publicId: string,
  ): Promise<{ result: string; message: string }> {
    try {
      this.logger.log(`Deleting file with public ID: ${publicId}`);

      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok') {
        return {
          result: 'ok',
          message: 'File deleted successfully',
        };
      } else {
        throw new Error(`Failed to delete file: ${result.result}`);
      }
    } catch (error) {
      this.logger.error(`Delete failed for public ID: ${publicId}`, error);
      throw new InternalServerErrorException(
        `Failed to delete file: ${error.message}`,
      );
    }
  }

  async deleteMultipleFiles(publicIds: string[]) {
    const results = {
      successful: [],
      failed: [],
      total: publicIds.length,
      successCount: 0,
      failureCount: 0,
    };

    for (const publicId of publicIds) {
      try {
        const deleteResult = await this.deleteFile(publicId);
        results.successful.push({ publicId, ...deleteResult });
        results.successCount++;
      } catch (error) {
        results.failed.push({
          publicId,
          error: error.message,
        });
        results.failureCount++;
      }
    }

    return results;
  }

  async generateSignedUploadUrl(
    uploadDto: UploadFileDto,
    expiresIn: number = 3600,
  ): Promise<{ uploadUrl: string; publicId: string }> {
    try {
      const uploadOptions = this.buildUploadOptions(uploadDto);
      const timestamp = Math.round(new Date().getTime() / 1000);

      const signature = cloudinary.utils.api_sign_request(
        {
          ...uploadOptions,
          timestamp,
        },
        this.configService.get<string>('CLOUDINARY_API_SECRET'),
      );

      const publicId = `${uploadDto.folder || 'general'}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${this.configService.get<string>('CLOUDINARY_CLOUD_NAME')}/image/upload`,
        publicId,
      };
    } catch (error) {
      this.logger.error('Failed to generate signed upload URL', error);
      throw new InternalServerErrorException(
        `Failed to generate signed upload URL: ${error.message}`,
      );
    }
  }

  async getImageInfo(publicId: string) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get image info for: ${publicId}`, error);
      throw new InternalServerErrorException(
        `Failed to get image info: ${error.message}`,
      );
    }
  }

  private validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes`,
      );
    }
  }

  private buildUploadOptions(uploadDto: UploadFileDto) {
    const options: any = {
      resource_type: 'auto',
      folder: uploadDto.folder || this.getDefaultFolder(uploadDto.uploadType),
    };

    if (uploadDto.tags && uploadDto.tags.length > 0) {
      options.tags = uploadDto.tags.join(',');
    }

    if (uploadDto.transformation) {
      options.transformation = this.buildTransformationOptions(
        uploadDto.transformation,
      );
    }

    return options;
  }

  private buildTransformationOptions(transformation: any) {
    const transforms = [];

    if (transformation.width || transformation.height) {
      const crop = transformation.crop || 'fill';
      transforms.push({
        width: transformation.width,
        height: transformation.height,
        crop,
      });
    }

    if (transformation.quality) {
      transforms.push({ quality: transformation.quality });
    }

    if (transformation.format) {
      transforms.push({ format: transformation.format });
    }

    return transforms;
  }

  private getDefaultFolder(uploadType: UploadType): string {
    const folderMap = {
      [UploadType.PROFILE]: 'profiles',
      [UploadType.POST]: 'posts',
      [UploadType.COMMENT]: 'comments',
      [UploadType.NETWORK]: 'networks',
      [UploadType.GENERAL]: 'general',
    };

    return folderMap[uploadType] || 'general';
  }
}
