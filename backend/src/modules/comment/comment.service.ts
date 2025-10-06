import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto, LikeCommentDto, UpdateCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createCommentDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.comment.create({
      data: createCommentDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileurl: true,
          },
        },
        post: {
          select: {
            id: true,
            body: true,
          },
        },
        likes: {
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
    return this.prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileurl: true,
          },
        },
        post: {
          select: {
            id: true,
            body: true,
          },
        },
        likes: {
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

  async findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileurl: true,
          },
        },
        post: {
          select: {
            id: true,
            body: true,
          },
        },
        likes: {
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

  async findByUser(userId: string) {
    return this.prisma.comment.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileurl: true,
          },
        },
        post: {
          select: {
            id: true,
            body: true,
          },
        },
        likes: {
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
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileurl: true,
          },
        },
        post: {
          select: {
            id: true,
            body: true,
          },
        },
        likes: {
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

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileurl: true,
          },
        },
        post: {
          select: {
            id: true,
            body: true,
          },
        },
        likes: {
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
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }

  async likeComment(commentId: string, likeCommentDto: LikeCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: likeCommentDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already liked
    const existingLike = await this.prisma.commentReaction.findFirst({
      where: {
        commentId: commentId,
        userId: likeCommentDto.userId,
      },
    });

    if (existingLike) {
      // Unlike - remove the reaction
      await this.prisma.commentReaction.delete({
        where: { id: existingLike.id },
      });
    } else {
      // Like - create new reaction
      await this.prisma.commentReaction.create({
        data: {
          commentId: commentId,
          userId: likeCommentDto.userId,
        },
      });
    }

    // Return updated comment with likes
    return this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileurl: true,
          },
        },
        post: {
          select: {
            id: true,
            body: true,
          },
        },
        likes: {
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
