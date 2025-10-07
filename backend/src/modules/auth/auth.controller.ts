import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt.auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    schema: {
      example: {
        userName: 'John Doe',
        userId: 'abc123',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  register(@Body() userData: RegisterDto) {
    delete userData.isAdmin; // To ensure users won't create admin from this route
    return this.authService.register(userData);
  }

  @UseGuards(AuthGuard('auth'))
  @Post('adminRegistration')
  @ApiOperation({ summary: 'Register a new admin user' })
  @ApiResponse({
    status: 201,
    description: 'Admin user successfully registered.',
    schema: {
      example: {
        userName: 'Admin User',
        userId: 'admin123',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  registerAdmin(@Body() userData: RegisterDto, @Req() req: any): Promise<any> {
    if (req.user?.isAdmin) {
      userData.isAdmin = true; // Ensure all users created from this route is an admin
      return this.authService.register(userData);
    } else {
      throw new ForbiddenException('You can not create this user');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    schema: {
      example: {
        message: 'Auth Successful',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        ACK: true,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginData: LoginDto) {
    const result = await this.authService.login(loginData);
    return result;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async refreshToken(@Body() data: any) {
    return this.authService.refreshToken(data.refreshToken);
  }

  @Post('adminLogin')
  @ApiOperation({ summary: 'Login an admin user' })
  @ApiResponse({
    status: 200,
    description: 'Admin user successfully logged in.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        userName: 'Admin User',
        userId: 'admin123',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  adminLogin(@Body() loginData: LoginDto) {
    return this.authService.adminLogin(loginData);
  }

  @Post('resetPassword')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset.',
    schema: {
      example: {
        message: 'Password reset successful.',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.resetPassword(email, newPassword, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-user/:id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully updated.',
    schema: {
      example: {
        message: 'User profile updated successfully.',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async updateUser(@Param('id') id: string, @Body() updateData) {
    return this.authService.updateUserProfile(updateData, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users successfully retrieved.',
    schema: {
      example: [
        {
          id: 'abc123',
          email: 'user1@example.com',
          name: 'User One',
          isAdmin: false,
        },
        {
          id: 'def456',
          email: 'user2@example.com',
          name: 'User Two',
          isAdmin: true,
        },
      ],
    },
  })
  @ApiBearerAuth()
  async getUsers() {
    return this.authService.getAllUsers();
  }
}
