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
import {
  AddMemberDto,
  CreateNetworkDto,
  RemoveMemberDto,
  UpdateNetworkDto,
} from './dto';
import { NetworkService } from './network.service';

@ApiTags('Networks')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new network' })
  @ApiResponse({
    status: 201,
    description: 'Network successfully created.',
    schema: {
      example: {
        id: 'network123',
        name: 'Tech Professionals',
        description: 'A network for tech professionals',
        avatar: 'https://example.com/avatar.jpg',
        memberIds: ['user123', 'user456'],
        administratorIds: ['user123'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createNetworkDto: CreateNetworkDto, @Request() req: any) {
    return this.networkService.create(createNetworkDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all networks' })
  @ApiResponse({
    status: 200,
    description: 'Networks successfully retrieved.',
    schema: {
      example: [
        {
          id: 'network123',
          name: 'Tech Professionals',
          description: 'A network for tech professionals',
          avatar: 'https://example.com/avatar.jpg',
          memberIds: ['user123', 'user456'],
          administratorIds: ['user123'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.networkService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get networks by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID', example: 'user123' })
  @ApiResponse({
    status: 200,
    description: 'User networks successfully retrieved.',
    schema: {
      example: [
        {
          id: 'network123',
          name: 'Tech Professionals',
          description: 'A network for tech professionals',
          avatar: 'https://example.com/avatar.jpg',
          memberIds: ['user123', 'user456'],
          administratorIds: ['user123'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findByUser(@Param('userId') userId: string) {
    return this.networkService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get network by ID' })
  @ApiParam({ name: 'id', description: 'Network ID', example: 'network123' })
  @ApiResponse({
    status: 200,
    description: 'Network successfully retrieved.',
    schema: {
      example: {
        id: 'network123',
        name: 'Tech Professionals',
        description: 'A network for tech professionals',
        avatar: 'https://example.com/avatar.jpg',
        memberIds: ['user123', 'user456'],
        administratorIds: ['user123'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Network not found.' })
  findOne(@Param('id') id: string) {
    return this.networkService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update network by ID' })
  @ApiParam({ name: 'id', description: 'Network ID', example: 'network123' })
  @ApiResponse({
    status: 200,
    description: 'Network successfully updated.',
    schema: {
      example: {
        id: 'network123',
        name: 'Updated Tech Professionals',
        description: 'An updated network for tech professionals',
        avatar: 'https://example.com/avatar.jpg',
        memberIds: ['user123', 'user456'],
        administratorIds: ['user123'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a network administrator.',
  })
  @ApiResponse({ status: 404, description: 'Network not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateNetworkDto: UpdateNetworkDto,
    @Request() req: any,
  ) {
    return this.networkService.update(id, updateNetworkDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete network by ID' })
  @ApiParam({ name: 'id', description: 'Network ID', example: 'network123' })
  @ApiResponse({
    status: 200,
    description: 'Network successfully deleted.',
    schema: {
      example: {
        message: 'Network deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a network administrator.',
  })
  @ApiResponse({ status: 404, description: 'Network not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.networkService.remove(id, req.user.id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to network' })
  @ApiParam({ name: 'id', description: 'Network ID', example: 'network123' })
  @ApiResponse({
    status: 200,
    description: 'Member successfully added to network.',
    schema: {
      example: {
        message: 'Member added successfully',
        networkId: 'network123',
        userId: 'user456',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a network administrator.',
  })
  @ApiResponse({ status: 404, description: 'Network not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @Request() req: any,
  ) {
    return this.networkService.addMember(id, addMemberDto, req.user.id);
  }

  @Delete(':id/members')
  @ApiOperation({ summary: 'Remove member from network' })
  @ApiParam({ name: 'id', description: 'Network ID', example: 'network123' })
  @ApiResponse({
    status: 200,
    description: 'Member successfully removed from network.',
    schema: {
      example: {
        message: 'Member removed successfully',
        networkId: 'network123',
        userId: 'user456',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a network administrator.',
  })
  @ApiResponse({ status: 404, description: 'Network not found.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  removeMember(
    @Param('id') id: string,
    @Body() removeMemberDto: RemoveMemberDto,
    @Request() req: any,
  ) {
    return this.networkService.removeMember(id, removeMemberDto, req.user.id);
  }
}
