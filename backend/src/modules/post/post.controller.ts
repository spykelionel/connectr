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
import { CreatePostDto, ReactToPostDto, UpdatePostDto } from './dto';
import { PostService } from './post.service';

@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post successfully created.',
    schema: {
      example: {
        id: 'post123',
        body: 'This is a sample post content',
        attachment: 'https://example.com/image.jpg',
        userId: 'user123',
        networkId: 'network123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return this.postService.create(createPostDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'Posts successfully retrieved.',
    schema: {
      example: [
        {
          id: 'post123',
          body: 'This is a sample post content',
          attachment: 'https://example.com/image.jpg',
          userId: 'user123',
          networkId: 'network123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.postService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get posts by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', example: 'user123' })
  @ApiResponse({
    status: 200,
    description: 'User posts successfully retrieved.',
    schema: {
      example: [
        {
          id: 'post123',
          body: 'This is a sample post content',
          attachment: 'https://example.com/image.jpg',
          userId: 'user123',
          networkId: 'network123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findByUser(@Param('userId') userId: string) {
    return this.postService.findByUser(userId);
  }

  @Get('network/:networkId')
  @ApiOperation({ summary: 'Get posts by network ID' })
  @ApiParam({
    name: 'networkId',
    description: 'Network ID',
    example: 'network123',
  })
  @ApiResponse({
    status: 200,
    description: 'Network posts successfully retrieved.',
    schema: {
      example: [
        {
          id: 'post123',
          body: 'This is a sample post content',
          attachment: 'https://example.com/image.jpg',
          userId: 'user123',
          networkId: 'network123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findByNetwork(@Param('networkId') networkId: string) {
    return this.postService.findByNetwork(networkId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', example: 'post123' })
  @ApiResponse({
    status: 200,
    description: 'Post successfully retrieved.',
    schema: {
      example: {
        id: 'post123',
        body: 'This is a sample post content',
        attachment: 'https://example.com/image.jpg',
        userId: 'user123',
        networkId: 'network123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', example: 'post123' })
  @ApiResponse({
    status: 200,
    description: 'Post successfully updated.',
    schema: {
      example: {
        id: 'post123',
        body: 'This is an updated post content',
        attachment: 'https://example.com/image.jpg',
        userId: 'user123',
        networkId: 'network123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the post owner.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ) {
    return this.postService.update(id, updatePostDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', example: 'post123' })
  @ApiResponse({
    status: 200,
    description: 'Post successfully deleted.',
    schema: {
      example: {
        message: 'Post deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the post owner.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.postService.remove(id, req.user.id);
  }

  @Post(':id/react')
  @ApiOperation({ summary: 'React to a post' })
  @ApiParam({ name: 'id', description: 'Post ID', example: 'post123' })
  @ApiResponse({
    status: 200,
    description: 'Reaction successfully added/updated.',
    schema: {
      example: {
        message: 'Reaction updated successfully',
        reactionType: 'upvote',
        userId: 'user123',
        postId: 'post123',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  reactToPost(
    @Param('id') postId: string,
    @Body() reactToPostDto: ReactToPostDto,
    @Request() req: any,
  ) {
    reactToPostDto.userId = req.user.id;
    return this.postService.reactToPost(postId, reactToPostDto);
  }
}
