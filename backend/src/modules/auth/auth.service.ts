import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
// import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// import { httpErrorException } from '../../core/services/utility.service';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import { httpErrorException } from 'src/core/services/utility.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  jwtService: any;
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(userData: RegisterDto): Promise<any> {
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const findUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (findUser) {
      throw new ForbiddenException('Email already registered, try login in.');
    }

    if (userData.name.length > 20) {
      throw new ForbiddenException('Name can not be more than 20 characters');
    }

    try {
      let user = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: passwordHash,
          isAdmin: false,
        },
      });

      delete user.password;
      const login = await this.login({
        email: userData.email,
        password: userData.password,
      });
      user = { ...user, ...login };

      return user;
    } catch (error) {
      console.log(error);
      httpErrorException(error);
    }
  }

  generateRandomPassword(length: number) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()-=_+[]{}|;:,.<>?';

    const allChars =
      uppercaseChars + lowercaseChars + numberChars + specialChars;

    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars.charAt(randomIndex);
    }

    return password;
  }

  async generateTokens(user: any): Promise<any> {
    delete user.password;
    delete user.isAdmin;
    delete user.updatedAt;
    delete user.refreshToken;
    const signToken = await this.jwt.signAsync(user, {
      expiresIn: '24h',
      secret: this.config.get('JWT_SECRET'),
    });
    const refreshToken = await this.jwt.signAsync(user, {
      expiresIn: '2days',
      secret: this.config.get('JWT_RefreshSecret'),
    });
    return {
      access_token: signToken,
      refresh_token: refreshToken,
    };
  }

  async login(loginData: LoginDto, passwordlessLogin?: boolean) {
    let user: any;
    try {
      user = await this.prisma.user.findUnique({
        where: { email: loginData.email },
      });
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }

    if (user?.isAdmin === true) {
      throw new ForbiddenException('You are not allowed to login here');
    }

    let isFavorite = false; // Initialize isFavorite as false

    if (user) {
      const password = await bcrypt.compare(loginData.password, user?.password);

      if (password || passwordlessLogin) {
        // Check if the user has a list of favorite ad IDs
        isFavorite =
          Array.isArray(user?.itFavorite) && user?.itFavorite.length > 0;

        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user?.id, tokens.refresh_token);

        return {
          ...tokens,
          isFavorite,
          userName: user?.name,
          userId: user?.id,
        };
      } else {
        throw new ForbiddenException('Incorrect Password');
      }
    } else {
      throw new ForbiddenException('User Not found');
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: refreshTokenHash,
      },
    });
  }

  async refreshToken(refreshToken: string): Promise<any> {
    let userDetails: any;
    try {
      userDetails = await this.jwt.verifyAsync<any>(refreshToken, {
        secret: process.env.JWT_RefreshSecret,
      });
    } catch {
      httpErrorException('Your login session has timed out. Login again');
    }
    const user: any = await this.prisma.user.findUnique({
      where: {
        id: userDetails.id,
      },
    });

    if (!user.refreshToken) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async adminLogin(loginData: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new ForbiddenException('User Not found or not an admin');
    }

    if (user.isAdmin === true) {
      const password = await bcrypt.compare(loginData.password, user.password);

      if (password) {
        delete user.password;
        const signToken = await this.jwt.signAsync(user, {
          expiresIn: '2h',
          secret: this.config.get('JWT_SECRET'),
        });
        return {
          access_token: signToken,
        };
      } else {
        throw new ForbiddenException('Incorrect Password');
      }
    } else {
      throw new ForbiddenException('User Not found or not an admin');
    }
  }

  async registerAdmin(userData: RegisterDto) {
    userData['isAdmin'] = true;
    let res: any;
    await this.register(userData).then((r) => {
      res = r;
    });
    return res;
  }

  async resetPassword(
    email: string,
    newPassword: string,
    refreshToken: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const checkRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!checkRefreshToken) throw new ForbiddenException('Access Denied');

    // Verify and hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: newPasswordHash,
      },
    });

    // Send an email confirmation to the user
    // await this.mailerService.sendMail({
    //   to: user.email,
    //   subject: 'Password Reset Successful',
    //   template: 'password-reset-success',
    // });

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async getUserIdFromToken(token: string): Promise<string | null> {
    try {
      const decodedToken: any = this.jwtService.verify(token);
      // Assuming your JWT payload contains the user ID as 'sub'
      return decodedToken.sub;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async updateUserProfile(user: any, userId: string): Promise<any> {
    const existingUser = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        message: 'No user with such Id found',
        data: {},
        statusCode: 404,
      };
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          ...user,
        },
      });
      return updatedUser;
    } catch (error) {
      return httpErrorException(error);
    }
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }
}
