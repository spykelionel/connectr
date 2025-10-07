import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto, LikeCommentDto, UpdateCommentDto } from './dto';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment successfully created.',
    schema: {
      example: {
        id: 'comment123',
        body: 'This is a sample comment',
        attachment: 'https://example.com/image.jpg',
        postId: 'post123',
        userId: 'user123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCommentDto: CreateCommentDto, @Request() req: any) {
    createCommentDto.userId = req.user.id;
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'Comments successfully retrieved.',
    schema: {
      example: [
        {
          id: 'comment123',
          body: 'This is a sample comment',
          attachment: 'https://example.com/image.jpg',
          postId: 'post123',
          userId: 'user123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.commentService.findAll();
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments by post ID' })
  @ApiParam({ name: 'postId', description: 'Post ID', example: 'post123' })
  @ApiResponse({
    status: 200,
    description: 'Post comments successfully retrieved.',
    schema: {
      example: [
        {
          id: 'comment123',
          body: 'This is a sample comment',
          attachment: 'https://example.com/image.jpg',
          postId: 'post123',
          userId: 'user123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get comments by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', example: 'user123' })
  @ApiResponse({
    status: 200,
    description: 'User comments successfully retrieved.',
    schema: {
      example: [
        {
          id: 'comment123',
          body: 'This is a sample comment',
          attachment: 'https://example.com/image.jpg',
          postId: 'post123',
          userId: 'user123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findByUser(@Param('userId') userId: string) {
    return this.commentService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID', example: 'comment123' })
  @ApiResponse({
    status: 200,
    description: 'Comment successfully retrieved.',
    schema: {
      example: {
        id: 'comment123',
        body: 'This is a sample comment',
        attachment: 'https://example.com/image.jpg',
        postId: 'post123',
        userId: 'user123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID', example: 'comment123' })
  @ApiResponse({
    status: 200,
    description: 'Comment successfully updated.',
    schema: {
      example: {
        id: 'comment123',
        body: 'This is an updated comment',
        attachment: 'https://example.com/image.jpg',
        postId: 'post123',
        userId: 'user123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the comment owner.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any,
  ) {
    return this.commentService.update(id, updateCommentDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID', example: 'comment123' })
  @ApiResponse({
    status: 200,
    description: 'Comment successfully deleted.',
    schema: {
      example: {
        message: 'Comment deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the comment owner.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.commentService.remove(id, req.user.id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like/unlike a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID', example: 'comment123' })
  @ApiResponse({
    status: 200,
    description: 'Comment like status successfully updated.',
    schema: {
      example: {
        message: 'Comment liked successfully',
        commentId: 'comment123',
        userId: 'user123',
        isLiked: true,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  likeComment(
    @Param('id') commentId: string,
    @Body() likeCommentDto: LikeCommentDto,
    @Request() req: any,
  ) {
    likeCommentDto.userId = req.user.id;
    return this.commentService.likeComment(commentId, likeCommentDto);
  }
}
