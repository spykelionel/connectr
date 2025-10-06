import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiPropertyOptional({
    description: 'Post content/body',
    example: 'This is a sample post content',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({
    description: 'Post attachment URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  attachment?: string;

  @ApiProperty({
    description: 'User ID who created the post',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Network ID where post belongs',
    example: 'network123',
  })
  @IsOptional()
  @IsString()
  networkId?: string;
}

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Post content/body',
    example: 'This is an updated post content',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({
    description: 'Post attachment URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  attachment?: string;
}

export class ReactToPostDto {
  @ApiProperty({ description: 'User ID who is reacting', example: 'user123' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Type of reaction',
    enum: ['upvote', 'downvote'],
    example: 'upvote',
  })
  @IsNotEmpty()
  @IsString()
  reactionType: 'upvote' | 'downvote';
}
