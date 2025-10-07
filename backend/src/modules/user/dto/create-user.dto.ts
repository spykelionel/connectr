import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'User gender', example: 'male' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'User contact number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiPropertyOptional({
    description: 'User profile image URL',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profileurl?: string;

  @ApiPropertyOptional({ description: 'Whether user is admin', example: false })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'password123',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiPropertyOptional({ description: 'User role ID', example: 'role123' })
  @IsOptional()
  @IsString()
  roleId?: string;
}
