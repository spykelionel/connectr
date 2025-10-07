export interface Post {
  id: string;
  body?: string;
  attachment?: string;
  userId: string;
  networkId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  network?: Network;
  comments?: Comment[];
  upvotes?: PostUpvote[];
  downvotes?: PostDownvote[];
}

export interface Comment {
  id: string;
  body?: string;
  attachment?: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  likes?: CommentReaction[];
}

export interface PostUpvote {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface PostDownvote {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface CommentReaction {
  id: string;
  userId: string;
  commentId: string;
  type: string;
  createdAt: string;
}

export interface CreatePostRequest {
  body?: string;
  attachment?: string;
  networkId?: string;
}

export interface ReactToPostRequest {
  reactionType: "upvote" | "downvote";
}

// Import User and Network types (these will be defined in their respective services)
import { Network } from "../../network/interface";
import { User } from "../../user/interface";
