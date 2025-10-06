import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name', example: 'Admin' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Administrator role with full access',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: 'Role name', example: 'Super Admin' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Super administrator role with enhanced access',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
