import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiPropertyOptional({
    description: 'Comment content/body',
    example: 'This is a sample comment',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({
    description: 'Comment attachment URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  attachment?: string;

  @ApiProperty({
    description: 'Post ID where comment belongs',
    example: 'post123',
  })
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty({
    description: 'User ID who created the comment',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: 'Comment content/body',
    example: 'This is an updated comment',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({
    description: 'Comment attachment URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  attachment?: string;
}

export class LikeCommentDto {
  @ApiProperty({
    description: 'User ID who is liking the comment',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
