import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AddMemberDto,
  CreateNetworkDto,
  RemoveMemberDto,
  UpdateNetworkDto,
} from './dto';

@Injectable()
export class NetworkService {
  constructor(private prisma: PrismaService) {}

  private async isUserAdministrator(
    networkId: string,
    userId: string,
  ): Promise<boolean> {
    const adminRecord = await this.prisma.networkAdministration.findFirst({
      where: {
        networkId: networkId,
        userId: userId,
      },
    });
    return !!adminRecord;
  }

  private async isUserMember(
    networkId: string,
    userId: string,
  ): Promise<boolean> {
    const memberRecord = await this.prisma.networkMembership.findFirst({
      where: {
        networkId: networkId,
        userId: userId,
      },
    });
    return !!memberRecord;
  }

  async create(createNetworkDto: CreateNetworkDto, userId: string) {
    // Verify all member IDs exist
    if (createNetworkDto.memberIds) {
      const members = await this.prisma.user.findMany({
        where: { id: { in: createNetworkDto.memberIds } },
      });

      if (members.length !== createNetworkDto.memberIds.length) {
        throw new BadRequestException('One or more member IDs are invalid');
      }
    }

    // Verify all administrator IDs exist
    if (createNetworkDto.administratorIds) {
      const administrators = await this.prisma.user.findMany({
        where: { id: { in: createNetworkDto.administratorIds } },
      });

      if (administrators.length !== createNetworkDto.administratorIds.length) {
        throw new BadRequestException(
          'One or more administrator IDs are invalid',
        );
      }
    }

    // Ensure creator is included in members and administrators
    const memberIds = createNetworkDto.memberIds || [];
    const administratorIds = createNetworkDto.administratorIds || [];

    if (!memberIds.includes(userId)) {
      memberIds.push(userId);
    }

    if (!administratorIds.includes(userId)) {
      administratorIds.push(userId);
    }

    const network = await this.prisma.network.create({
      data: {
        name: createNetworkDto.name,
        description: createNetworkDto.description,
        avatar: createNetworkDto.avatar || 'default_avatar',
      },
    });

    // Create memberships
    for (const memberId of memberIds) {
      await this.prisma.networkMembership.create({
        data: {
          networkId: network.id,
          userId: memberId,
        },
      });
    }

    // Create administrations
    for (const adminId of administratorIds) {
      await this.prisma.networkAdministration.create({
        data: {
          networkId: network.id,
          userId: adminId,
        },
      });
    }

    return this.prisma.network.findUnique({
      where: { id: network.id },
      include: {
        memberships: {
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
        },
        administrations: {
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
        },
        posts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileurl: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.network.findMany({
      include: {
        memberships: {
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
        },
        administrations: {
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
        },
        posts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileurl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const network = await this.prisma.network.findUnique({
      where: { id },
      include: {
        memberships: {
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
        },
        administrations: {
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
        },
        posts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileurl: true,
              },
            },
          },
        },
      },
    });

    if (!network) {
      throw new NotFoundException('Network not found');
    }

    return network;
  }

  async findByUser(userId: string) {
    return this.prisma.network.findMany({
      where: {
        memberships: {
          some: { userId: userId },
        },
      },
      include: {
        memberships: {
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
        },
        administrations: {
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
        },
        posts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileurl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateNetworkDto: UpdateNetworkDto, userId: string) {
    const network = await this.prisma.network.findUnique({
      where: { id },
      include: {
        administrations: true,
      },
    });

    if (!network) {
      throw new NotFoundException('Network not found');
    }

    const isAdministrator = await this.isUserAdministrator(id, userId);
    if (!isAdministrator) {
      throw new ForbiddenException(
        'Only administrators can update the network',
      );
    }

    return this.prisma.network.update({
      where: { id },
      data: updateNetworkDto,
      include: {
        memberships: {
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
        },
        administrations: {
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
        },
        posts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileurl: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const network = await this.prisma.network.findUnique({
      where: { id },
      include: {
        administrations: true,
      },
    });

    if (!network) {
      throw new NotFoundException('Network not found');
    }

    const isAdministrator = await this.isUserAdministrator(id, userId);
    if (!isAdministrator) {
      throw new ForbiddenException(
        'Only administrators can delete the network',
      );
    }

    return this.prisma.network.delete({
      where: { id },
    });
  }

  async addMember(id: string, addMemberDto: AddMemberDto, userId: string) {
    const network = await this.prisma.network.findUnique({
      where: { id },
      include: {
        administrations: true,
        memberships: true,
      },
    });

    if (!network) {
      throw new NotFoundException('Network not found');
    }

    const isAdministrator = await this.isUserAdministrator(id, userId);
    if (!isAdministrator) {
      throw new ForbiddenException('Only administrators can add members');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: addMemberDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAlreadyMember = await this.isUserMember(id, addMemberDto.userId);
    if (isAlreadyMember) {
      throw new BadRequestException('User is already a member of this network');
    }

    // Add member to network
    await this.prisma.networkMembership.create({
      data: {
        networkId: id,
        userId: addMemberDto.userId,
      },
    });

    return this.prisma.network.findUnique({
      where: { id },
      include: {
        memberships: {
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
        },
        administrations: {
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
        },
        posts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileurl: true,
              },
            },
          },
        },
      },
    });
  }

  async removeMember(
    id: string,
    removeMemberDto: RemoveMemberDto,
    userId: string,
  ) {
    const network = await this.prisma.network.findUnique({
      where: { id },
    });

    if (!network) {
      throw new NotFoundException('Network not found');
    }

    const isAdministrator = await this.isUserAdministrator(id, userId);
    if (!isAdministrator) {
      throw new ForbiddenException('Only administrators can remove members');
    }

    const isMember = await this.isUserMember(id, removeMemberDto.userId);
    if (!isMember) {
      throw new BadRequestException('User is not a member of this network');
    }

    // Prevent removing administrators
    const isAdmin = await this.isUserAdministrator(id, removeMemberDto.userId);
    if (isAdmin) {
      throw new BadRequestException(
        'Cannot remove administrators from the network',
      );
    }

    // Remove member from network
    await this.prisma.networkMembership.deleteMany({
      where: {
        networkId: id,
        userId: removeMemberDto.userId,
      },
    });

    return this.prisma.network.findUnique({
      where: { id },
      include: {
        memberships: {
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
        },
        administrations: {
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
        },
        posts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileurl: true,
              },
            },
          },
        },
      },
    });
  }

  async joinNetwork(networkId: string, userId: string) {
    console.log('Join Network - NetworkId:', networkId, 'UserId:', userId); // Debug log

    // Verify network exists
    const network = await this.prisma.network.findUnique({
      where: { id: networkId },
    });

    if (!network) {
      throw new NotFoundException('Network not found');
    }

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log('User not found in database:', userId); // Debug log
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const isAlreadyMember = await this.isUserMember(networkId, userId);
    if (isAlreadyMember) {
      throw new BadRequestException('User is already a member of this network');
    }

    // Add user as member
    await this.prisma.networkMembership.create({
      data: {
        networkId: networkId,
        userId: userId,
      },
    });

    return {
      message: 'Successfully joined network',
      networkId: networkId,
      userId: userId,
    };
  }

  async leaveNetwork(networkId: string, userId: string) {
    // Verify network exists
    const network = await this.prisma.network.findUnique({
      where: { id: networkId },
    });

    if (!network) {
      throw new NotFoundException('Network not found');
    }

    // Check if user is a member
    const isMember = await this.isUserMember(networkId, userId);
    if (!isMember) {
      throw new BadRequestException('User is not a member of this network');
    }

    // Remove membership
    await this.prisma.networkMembership.deleteMany({
      where: {
        networkId: networkId,
        userId: userId,
      },
    });

    return {
      message: 'Successfully left network',
      networkId: networkId,
      userId: userId,
    };
  }
}
