import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConnectionDto, UpdateConnectionStatusDto } from './dto';

@Injectable()
export class ConnectionService {
  constructor(private prisma: PrismaService) {}

  async createConnection(
    userId: string,
    createConnectionDto: CreateConnectionDto,
  ) {
    const { friendId } = createConnectionDto;

    // Check if user is trying to connect with themselves
    if (userId === friendId) {
      throw new ConflictException('Cannot connect with yourself');
    }

    // Check if friend exists
    const friend = await this.prisma.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    // Check if connection already exists
    const existingConnection = await this.prisma.userConnection.findFirst({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    if (existingConnection) {
      throw new ConflictException('Connection already exists');
    }

    // Create new connection
    const connection = await this.prisma.userConnection.create({
      data: {
        userId,
        friendId,
        status: 'pending',
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
      },
    });

    return connection;
  }

  async getConnections(userId: string, status?: string) {
    const whereClause: any = {
      OR: [{ userId }, { friendId: userId }],
    };

    if (status) {
      whereClause.status = status;
    }

    const connections = await this.prisma.userConnection.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to always show the other user as 'friend'
    return connections.map((connection) => ({
      ...connection,
      friend:
        connection.userId === userId ? connection.friend : connection.user,
    }));
  }

  async getConnectionById(id: string, userId: string) {
    const connection = await this.prisma.userConnection.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
      },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    // Check if user is part of this connection
    if (connection.userId !== userId && connection.friendId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      ...connection,
      friend:
        connection.userId === userId ? connection.friend : connection.user,
    };
  }

  async updateConnectionStatus(
    id: string,
    userId: string,
    updateDto: UpdateConnectionStatusDto,
  ) {
    const connection = await this.prisma.userConnection.findUnique({
      where: { id },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    // Only the friend (receiver) can accept/block connections
    if (connection.friendId !== userId) {
      throw new ForbiddenException(
        'Only the friend can update connection status',
      );
    }

    // Only pending connections can be updated
    if (connection.status !== 'pending') {
      throw new ConflictException('Connection status cannot be changed');
    }

    const updatedConnection = await this.prisma.userConnection.update({
      where: { id },
      data: {
        status: updateDto.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
      },
    });

    return {
      ...updatedConnection,
      friend:
        updatedConnection.userId === userId
          ? updatedConnection.friend
          : updatedConnection.user,
    };
  }

  async removeConnection(id: string, userId: string) {
    const connection = await this.prisma.userConnection.findUnique({
      where: { id },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    // Check if user is part of this connection
    if (connection.userId !== userId && connection.friendId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.userConnection.delete({
      where: { id },
    });

    return { message: 'Connection removed successfully' };
  }

  async getFriends(userId: string) {
    const connections = await this.prisma.userConnection.findMany({
      where: {
        OR: [
          { userId, status: 'accepted' },
          { friendId: userId, status: 'accepted' },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
      },
    });

    // Return only the friend information
    return connections.map((connection) => ({
      ...connection,
      friend:
        connection.userId === userId ? connection.friend : connection.user,
    }));
  }

  async getPendingConnections(userId: string) {
    const connections = await this.prisma.userConnection.findMany({
      where: {
        friendId: userId,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return connections.map((connection) => ({
      ...connection,
      friend: connection.user,
    }));
  }
}
