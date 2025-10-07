export interface Connection {
  id: string;
  userId: string;
  friendId: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
  updatedAt: string;
  friend?: User;
}

export interface CreateConnectionRequest {
  friendId: string;
}

export interface UpdateConnectionStatusRequest {
  status: "accepted" | "blocked";
}

// Import User type (this will be defined in user service)
import { User } from "../../user/interface";
