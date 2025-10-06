import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { CloudinaryService } from './cloudinary.service';
import {
  BulkUploadResponseDto,
  DeleteResponseDto,
  UploadFileDto,
  UploadResponseDto,
} from './dto';
import {
  FileValidationPipe,
  NetworkImageValidationPipe,
  PostImageValidationPipe,
  ProfileImageValidationPipe,
} from './pipes/file-validation.pipe';

@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('single')
  @ApiOperation({ summary: 'Upload a single file to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully.',
    type: UploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid file or parameters.',
  })
  @ApiResponse({
    status: 413,
    description: 'Payload Too Large - File size exceeds limit.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Upload failed.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FileValidationPipe())
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
  ): Promise<UploadResponseDto> {
    return this.cloudinaryService.uploadFile(file, uploadDto);
  }

  @Post('profile')
  @ApiOperation({ summary: 'Upload profile image with optimized settings' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Profile image uploaded successfully.',
    schema: {
      example: {
        public_id: 'profiles/user123_avatar',
        secure_url:
          'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profiles/user123_avatar.jpg',
        format: 'jpg',
        bytes: 245760,
        width: 300,
        height: 300,
        created_at: '2024-01-01T00:00:00.000Z',
        uploadType: 'profile',
        folder: 'profiles',
        tags: ['avatar', 'profile'],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid image file.',
  })
  @ApiResponse({
    status: 413,
    description: 'Payload Too Large - Image size exceeds 5MB limit.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ProfileImageValidationPipe)
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
  ): Promise<UploadResponseDto> {
    const profileUploadDto = {
      ...uploadDto,
      uploadType: 'profile' as any,
      transformation: {
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        format: 'jpg' as any,
        ...uploadDto.transformation,
      },
    };

    return this.cloudinaryService.uploadFile(file, profileUploadDto);
  }

  @Post('post')
  @ApiOperation({ summary: 'Upload post image with optimized settings' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Post image uploaded successfully.',
    schema: {
      example: {
        public_id: 'posts/post123_image',
        secure_url:
          'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/posts/post123_image.jpg',
        format: 'jpg',
        bytes: 1024000,
        width: 800,
        height: 600,
        created_at: '2024-01-01T00:00:00.000Z',
        uploadType: 'post',
        folder: 'posts',
        tags: ['post', 'content'],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid image file.',
  })
  @ApiResponse({
    status: 413,
    description: 'Payload Too Large - Image size exceeds 10MB limit.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(PostImageValidationPipe)
  async uploadPostImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
  ): Promise<UploadResponseDto> {
    const postUploadDto = {
      ...uploadDto,
      uploadType: 'post' as any,
      transformation: {
        quality: 'auto',
        format: 'webp' as any,
        ...uploadDto.transformation,
      },
    };

    return this.cloudinaryService.uploadFile(file, postUploadDto);
  }

  @Post('network')
  @ApiOperation({ summary: 'Upload network avatar with optimized settings' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Network avatar uploaded successfully.',
    schema: {
      example: {
        public_id: 'networks/network123_avatar',
        secure_url:
          'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/networks/network123_avatar.jpg',
        format: 'jpg',
        bytes: 180000,
        width: 200,
        height: 200,
        created_at: '2024-01-01T00:00:00.000Z',
        uploadType: 'network',
        folder: 'networks',
        tags: ['network', 'avatar'],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid image file.',
  })
  @ApiResponse({
    status: 413,
    description: 'Payload Too Large - Image size exceeds 5MB limit.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(NetworkImageValidationPipe)
  async uploadNetworkAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
  ): Promise<UploadResponseDto> {
    const networkUploadDto = {
      ...uploadDto,
      uploadType: 'network' as any,
      transformation: {
        width: 200,
        height: 200,
        crop: 'fill',
        quality: 'auto',
        format: 'jpg' as any,
        ...uploadDto.transformation,
      },
    };

    return this.cloudinaryService.uploadFile(file, networkUploadDto);
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Files upload completed with results.',
    type: BulkUploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid files or parameters.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @UsePipes(new FileValidationPipe())
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadDto: UploadFileDto,
  ): Promise<BulkUploadResponseDto> {
    return this.cloudinaryService.uploadMultipleFiles(files, uploadDto);
  }

  @Post('from-url')
  @ApiOperation({ summary: 'Upload image from URL to Cloudinary' })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded from URL successfully.',
    type: UploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid URL or parameters.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Failed to fetch or upload image.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async uploadFromUrl(
    @Body() body: { imageUrl: string } & UploadFileDto,
  ): Promise<UploadResponseDto> {
    const { imageUrl, ...uploadDto } = body;
    return this.cloudinaryService.uploadFromUrl(imageUrl, uploadDto);
  }

  @Post('signed-url')
  @ApiOperation({
    summary: 'Generate signed upload URL for client-side uploads',
  })
  @ApiResponse({
    status: 201,
    description: 'Signed upload URL generated successfully.',
    schema: {
      example: {
        uploadUrl: 'https://api.cloudinary.com/v1_1/your-cloud/image/upload',
        publicId: 'general/1640995200000_abc123def',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Failed to generate signed URL.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async generateSignedUploadUrl(@Body() uploadDto: UploadFileDto) {
    return this.cloudinaryService.generateSignedUploadUrl(uploadDto);
  }

  @Delete(':publicId')
  @ApiOperation({ summary: 'Delete file from Cloudinary' })
  @ApiParam({
    name: 'publicId',
    description: 'Cloudinary public ID of the file to delete',
    example: 'profiles/user123_avatar',
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully.',
    type: DeleteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Failed to delete file.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteFile(
    @Param('publicId') publicId: string,
  ): Promise<DeleteResponseDto> {
    return this.cloudinaryService.deleteFile(publicId);
  }

  @Post('delete-multiple')
  @ApiOperation({ summary: 'Delete multiple files from Cloudinary' })
  @ApiResponse({
    status: 200,
    description: 'Bulk delete operation completed.',
    schema: {
      example: {
        successful: [
          {
            publicId: 'profiles/user123_avatar',
            result: 'ok',
            message: 'File deleted successfully',
          },
        ],
        failed: [{ publicId: 'profiles/invalid_id', error: 'File not found' }],
        total: 2,
        successCount: 1,
        failureCount: 1,
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteMultipleFiles(@Body() body: { publicIds: string[] }) {
    return this.cloudinaryService.deleteMultipleFiles(body.publicIds);
  }

  @Post('info/:publicId')
  @ApiOperation({ summary: 'Get file information from Cloudinary' })
  @ApiParam({
    name: 'publicId',
    description: 'Cloudinary public ID of the file',
    example: 'profiles/user123_avatar',
  })
  @ApiResponse({
    status: 200,
    description: 'File information retrieved successfully.',
    schema: {
      example: {
        public_id: 'profiles/user123_avatar',
        format: 'jpg',
        bytes: 245760,
        width: 300,
        height: 300,
        created_at: '2024-01-01T00:00:00.000Z',
        secure_url:
          'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profiles/user123_avatar.jpg',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getFileInfo(@Param('publicId') publicId: string) {
    return this.cloudinaryService.getImageInfo(publicId);
  }
}
