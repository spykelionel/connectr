import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configureCloudinary } from './core/config/cloudinary.config';
import { ResponseTemplateInterceptor } from './core/interceptors/response-template/response-template.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { ConnectionModule } from './modules/connection/connection.module';
import { NetworkModule } from './modules/network/network.module';
import { PostModule } from './modules/post/post.module';
import { RoleModule } from './modules/role/role.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    NetworkModule,
    RoleModule,
    ConnectionModule,
    UploadModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [
    {
      provide: 'CLOUDINARY_CONFIG',
      useFactory: (configService: ConfigService) =>
        configureCloudinary(configService),
      inject: [ConfigService],
    },
    ResponseTemplateInterceptor,
  ],
})
export class AppModule {}
