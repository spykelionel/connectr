import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;

    const resourceType = this.reflector.get<string>(
      'resourceType',
      context.getHandler(),
    );
    if (!resourceType) {
      return true;
    }

    let resource;
    switch (resourceType) {
      case 'user':
        resource = await this.prisma.user.findUnique({
          where: { id: resourceId },
        });
        if (!resource && user?.isAdmin) {
          resource = true;
        }
        break;
      case 'channel':
        resource = await this.prisma.channel.findUnique({
          where: { id: resourceId },
        });
        break;
      case 'lesson':
        resource = await this.prisma.lesson.findUnique({
          where: { id: resourceId },
        });
        break;
      case 'quiz':
        resource = await this.prisma.quiz.findUnique({
          where: { id: resourceId },
        });
        break;
      default:
        throw new ForbiddenException('Unknown resource type');
    }

    if (!resource) {
      throw new ForbiddenException(
        "Resource doesn't exist or You do not have permission to modify this resource",
      );
    }

    return true;
  }
}
