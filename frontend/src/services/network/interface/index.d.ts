export interface Network {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  posts?: Post[];
  memberships?: NetworkMembership[];
  administrations?: NetworkAdministration[];
}

export interface NetworkMembership {
  id: string;
  userId: string;
  networkId: string;
  joinedAt: string;
}

export interface NetworkAdministration {
  id: string;
  userId: string;
  networkId: string;
  role: string;
  assignedAt: string;
}

export interface CreateNetworkRequest {
  name: string;
  description?: string;
  avatar?: string;
}

export interface AddMemberRequest {
  userId: string;
}

export interface RemoveMemberRequest {
  userId: string;
}

// Import Post type (this will be defined in post service)
import { Post } from "../../post/interface";
