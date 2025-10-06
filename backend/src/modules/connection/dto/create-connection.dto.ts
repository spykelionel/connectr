import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConnectionDto {
  @ApiProperty({
    description: 'User ID of the friend to connect with',
    example: 'user456',
  })
  @IsNotEmpty()
  @IsString()
  friendId: string;
}

export class UpdateConnectionStatusDto {
  @ApiProperty({
    description: 'Connection status',
    enum: ['pending', 'accepted', 'blocked'],
    example: 'accepted',
  })
  @IsNotEmpty()
  @IsString()
  status: 'pending' | 'accepted' | 'blocked';
}

export class ConnectionResponseDto {
  @ApiProperty({
    description: 'Connection ID',
    example: 'conn123',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who initiated the connection',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Friend ID who received the connection',
    example: 'user456',
  })
  friendId: string;

  @ApiProperty({
    description: 'Connection status',
    enum: ['pending', 'accepted', 'blocked'],
    example: 'accepted',
  })
  status: string;

  @ApiProperty({
    description: 'Connection creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Connection last update date',
    example: '2024-01-01T12:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Friend user details',
    example: {
      id: 'user456',
      name: 'Jane Doe',
      email: 'jane@example.com',
      profileurl: 'https://example.com/jane.jpg',
    },
  })
  friend?: {
    id: string;
    name: string;
    email: string;
    profileurl?: string;
  };
}
