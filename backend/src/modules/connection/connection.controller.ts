import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { ConnectionService } from './connection.service';
import { CreateConnectionDto, UpdateConnectionStatusDto } from './dto';

@ApiTags('Connections')
@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post()
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({
    status: 201,
    description: 'Friend request sent successfully.',
    schema: {
      example: {
        id: 'conn123',
        userId: 'user123',
        friendId: 'user456',
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        friend: {
          id: 'user456',
          name: 'Jane Doe',
          email: 'jane@example.com',
          profileurl: 'https://example.com/jane.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Connection already exists.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createConnection(
    @Body() createConnectionDto: CreateConnectionDto,
    @Request() req: any,
  ) {
    return this.connectionService.createConnection(
      req.user.id,
      createConnectionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all connections for the user' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by connection status',
    enum: ['pending', 'accepted', 'blocked'],
    example: 'accepted',
  })
  @ApiResponse({
    status: 200,
    description: 'Connections successfully retrieved.',
    schema: {
      example: [
        {
          id: 'conn123',
          userId: 'user123',
          friendId: 'user456',
          status: 'accepted',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z',
          friend: {
            id: 'user456',
            name: 'Jane Doe',
            email: 'jane@example.com',
            profileurl: 'https://example.com/jane.jpg',
          },
        },
      ],
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getConnections(@Query('status') status: string, @Request() req: any) {
    return this.connectionService.getConnections(req.user.id, status);
  }

  @Get('friends')
  @ApiOperation({ summary: 'Get all accepted friends' })
  @ApiResponse({
    status: 200,
    description: 'Friends successfully retrieved.',
    schema: {
      example: [
        {
          id: 'conn123',
          userId: 'user123',
          friendId: 'user456',
          status: 'accepted',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z',
          friend: {
            id: 'user456',
            name: 'Jane Doe',
            email: 'jane@example.com',
            profileurl: 'https://example.com/jane.jpg',
          },
        },
      ],
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getFriends(@Request() req: any) {
    return this.connectionService.getFriends(req.user.id);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending friend requests' })
  @ApiResponse({
    status: 200,
    description: 'Pending requests successfully retrieved.',
    schema: {
      example: [
        {
          id: 'conn123',
          userId: 'user789',
          friendId: 'user123',
          status: 'pending',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          friend: {
            id: 'user789',
            name: 'John Smith',
            email: 'john@example.com',
            profileurl: 'https://example.com/john.jpg',
          },
        },
      ],
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getPendingConnections(@Request() req: any) {
    return this.connectionService.getPendingConnections(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get connection by ID' })
  @ApiParam({ name: 'id', description: 'Connection ID', example: 'conn123' })
  @ApiResponse({
    status: 200,
    description: 'Connection successfully retrieved.',
    schema: {
      example: {
        id: 'conn123',
        userId: 'user123',
        friendId: 'user456',
        status: 'accepted',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T12:00:00.000Z',
        friend: {
          id: 'user456',
          name: 'Jane Doe',
          email: 'jane@example.com',
          profileurl: 'https://example.com/jane.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @ApiResponse({ status: 404, description: 'Connection not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getConnectionById(@Param('id') id: string, @Request() req: any) {
    return this.connectionService.getConnectionById(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Accept or block a friend request' })
  @ApiParam({ name: 'id', description: 'Connection ID', example: 'conn123' })
  @ApiResponse({
    status: 200,
    description: 'Connection status updated successfully.',
    schema: {
      example: {
        id: 'conn123',
        userId: 'user789',
        friendId: 'user123',
        status: 'accepted',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T12:00:00.000Z',
        friend: {
          id: 'user789',
          name: 'John Smith',
          email: 'john@example.com',
          profileurl: 'https://example.com/john.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Only the friend can update connection status.',
  })
  @ApiResponse({ status: 404, description: 'Connection not found.' })
  @ApiResponse({
    status: 409,
    description: 'Connection status cannot be changed.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateConnectionStatus(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateDto: UpdateConnectionStatusDto,
  ) {
    return this.connectionService.updateConnectionStatus(
      id,
      req.user.id,
      updateDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a connection' })
  @ApiParam({ name: 'id', description: 'Connection ID', example: 'conn123' })
  @ApiResponse({
    status: 200,
    description: 'Connection removed successfully.',
    schema: {
      example: {
        message: 'Connection removed successfully',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @ApiResponse({ status: 404, description: 'Connection not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  removeConnection(@Param('id') id: string, @Request() req: any) {
    return this.connectionService.removeConnection(id, req.user.id);
  }
}
