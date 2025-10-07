import { PartialType } from '@nestjs/swagger';
import { CreateNetworkDto } from './create-network.dto';

export class UpdateNetworkDto extends PartialType(CreateNetworkDto) {}
