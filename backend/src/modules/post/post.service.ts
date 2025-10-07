import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto, ReactToPostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If networkId is provided, verify network exists
    if (createPostDto.networkId) {
      const network = await this.prisma.network.findUnique({
        where: { id: createPostDto.networkId },
      });

      if (!network) {
        throw new NotFoundException('Network not found');
      }
    }

    return this.prisma.post.create({
      data: {
        ...createPostDto,
        userId,
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
        network: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
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
        upvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        downvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
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
        upvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        downvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
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
    const post = await this.prisma.post.findUnique({
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
        network: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
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
        upvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        downvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findByUser(userId: string) {
    return this.prisma.post.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
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
        upvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        downvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
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

  async findByNetwork(networkId: string) {
    return this.prisma.post.findMany({
      where: { networkId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
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
        upvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        downvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
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

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
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
        upvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        downvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  async reactToPost(postId: string, reactToPostDto: ReactToPostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: reactToPostDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove user from opposite reaction first
    if (reactToPostDto.reactionType === 'upvote') {
      // Remove any existing downvote
      await this.prisma.postDownvote.deleteMany({
        where: {
          postId: postId,
          userId: reactToPostDto.userId,
        },
      });

      // Check if already upvoted
      const existingUpvote = await this.prisma.postUpvote.findFirst({
        where: {
          postId: postId,
          userId: reactToPostDto.userId,
        },
      });

      if (existingUpvote) {
        // Remove upvote
        await this.prisma.postUpvote.delete({
          where: { id: existingUpvote.id },
        });
      } else {
        // Add upvote
        await this.prisma.postUpvote.create({
          data: {
            postId: postId,
            userId: reactToPostDto.userId,
          },
        });
      }
    } else {
      // Remove any existing upvote
      await this.prisma.postUpvote.deleteMany({
        where: {
          postId: postId,
          userId: reactToPostDto.userId,
        },
      });

      // Check if already downvoted
      const existingDownvote = await this.prisma.postDownvote.findFirst({
        where: {
          postId: postId,
          userId: reactToPostDto.userId,
        },
      });

      if (existingDownvote) {
        // Remove downvote
        await this.prisma.postDownvote.delete({
          where: { id: existingDownvote.id },
        });
      } else {
        // Add downvote
        await this.prisma.postDownvote.create({
          data: {
            postId: postId,
            userId: reactToPostDto.userId,
          },
        });
      }
    }

    // Return updated post with reactions
    return this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileurl: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
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
        upvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        downvotes: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
