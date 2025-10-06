import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNetworkDto {
  @ApiProperty({ description: 'Network name', example: 'Tech Professionals' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Network description',
    example: 'A network for tech professionals',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Network avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Array of member user IDs',
    example: ['user123', 'user456'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @ApiPropertyOptional({
    description: 'Array of administrator user IDs',
    example: ['user123'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  administratorIds?: string[];
}

export class UpdateNetworkDto {
  @ApiPropertyOptional({
    description: 'Network name',
    example: 'Updated Tech Professionals',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Network description',
    example: 'An updated network for tech professionals',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Network avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class AddMemberDto {
  @ApiProperty({ description: 'User ID to add to network', example: 'user456' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class RemoveMemberDto {
  @ApiProperty({
    description: 'User ID to remove from network',
    example: 'user456',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
