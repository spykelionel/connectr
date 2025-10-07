import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    schema: {
      example: {
        id: 'abc123',
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
        contact: '+1234567890',
        profileurl: 'https://example.com/profile.jpg',
        isAdmin: false,
        roleId: 'role123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('profileurl'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createUserDto.profileurl = file.path;
    }
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users successfully retrieved.',
    schema: {
      example: [
        {
          id: 'abc123',
          name: 'John Doe',
          email: 'john@example.com',
          gender: 'male',
          contact: '+1234567890',
          profileurl: 'https://example.com/profile.jpg',
          isAdmin: false,
          roleId: 'role123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 'abc123' })
  @ApiResponse({
    status: 200,
    description: 'User successfully retrieved.',
    schema: {
      example: {
        id: 'abc123',
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
        contact: '+1234567890',
        profileurl: 'https://example.com/profile.jpg',
        isAdmin: false,
        roleId: 'role123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 'abc123' })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated.',
    schema: {
      example: {
        id: 'abc123',
        name: 'John Doe Updated',
        email: 'john@example.com',
        gender: 'male',
        contact: '+1234567890',
        profileurl: 'https://example.com/profile.jpg',
        isAdmin: false,
        roleId: 'role123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 'abc123' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted.',
    schema: {
      example: {
        message: 'User deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all users' })
  @ApiResponse({
    status: 200,
    description: 'All users successfully deleted.',
    schema: {
      example: {
        message: 'All users deleted successfully',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  removeAll() {
    return this.userService.removeAll();
  }
}
