import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  gender?: string;
  contact?: string;
  profileurl?: string;
  isAdmin: boolean;
  roleId?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface Connection {
  id: string;
  userId: string;
  friendId: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
  updatedAt: string;
  friend?: User;
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

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  gender?: string;
  contact?: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    id: string;
    name: string;
    gender?: string | null;
    email: string;
    contact?: string | null;
    profileurl?: string | null;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    refreshToken?: string | null;
    roleId?: string | null;
    access_token: string;
    refresh_token: string;
    isFavorite?: boolean;
    userName: string;
    userId: string;
    user?: {
      id: string;
      name: string;
      gender?: string | null;
      email: string;
      contact?: string | null;
      profileurl?: string | null;
      createdAt: string;
      roleId?: string | null;
    };
  };
}

// Post types
export interface CreatePostRequest {
  body?: string;
  attachment?: string;
  networkId?: string;
}

export interface ReactToPostRequest {
  reactionType: "upvote" | "downvote";
}

// Network types
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

// Connection types
export interface CreateConnectionRequest {
  friendId: string;
}

export interface UpdateConnectionStatusRequest {
  status: "accepted" | "blocked";
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Post", "Network", "Connection", "Comment"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (data) => ({
        url: "auth/refresh",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { email: string; newPassword: string; refreshToken: string }
    >({
      query: (data) => ({
        url: "auth/resetPassword",
        method: "POST",
        body: data,
      }),
    }),

    // User endpoints
    getUsers: builder.query<User[], void>({
      query: () => "auth/users",
      providesTags: ["User"],
    }),
    getUser: builder.query<User, string>({
      query: (id) => `user/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `auth/update-user/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),

    // Post endpoints
    getPosts: builder.query<Post[], void>({
      query: () => "post",
      providesTags: ["Post"],
      transformResponse: (response: any) => {
        // Handle the actual backend response structure
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getPost: builder.query<Post, string>({
      query: (id) => `post/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),
    getUserPosts: builder.query<Post[], string>({
      query: (userId) => `post/user/${userId}`,
      providesTags: ["Post"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getNetworkPosts: builder.query<Post[], string>({
      query: (networkId) => `post/network/${networkId}`,
      providesTags: ["Post"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (postData) => ({
        url: "post",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation<Post, { id: string; data: Partial<Post> }>({
      query: ({ id, data }) => ({
        url: `post/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Post", id }],
    }),
    deletePost: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    reactToPost: builder.mutation<
      { message: string },
      { postId: string; reactionType: "upvote" | "downvote" }
    >({
      query: ({ postId, reactionType }) => ({
        url: `post/${postId}/react`,
        method: "POST",
        body: { reactionType },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Post", id: postId },
        "Post",
      ],
    }),

    // Network endpoints
    getNetworks: builder.query<Network[], void>({
      query: () => "network",
      providesTags: ["Network"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getNetwork: builder.query<Network, string>({
      query: (id) => `network/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Network", id }],
    }),
    getUserNetworks: builder.query<Network[], string>({
      query: (userId) => `network/user/${userId}`,
      providesTags: ["Network"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    createNetwork: builder.mutation<Network, CreateNetworkRequest>({
      query: (networkData) => ({
        url: "network",
        method: "POST",
        body: networkData,
      }),
      invalidatesTags: ["Network"],
    }),
    updateNetwork: builder.mutation<
      Network,
      { id: string; data: Partial<Network> }
    >({
      query: ({ id, data }) => ({
        url: `network/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Network", id }],
    }),
    deleteNetwork: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `network/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Network"],
    }),
    addNetworkMember: builder.mutation<
      { message: string },
      { networkId: string; userId: string }
    >({
      query: ({ networkId, userId }) => ({
        url: `network/${networkId}/members`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { networkId }) => [
        { type: "Network", id: networkId },
      ],
    }),
    removeNetworkMember: builder.mutation<
      { message: string },
      { networkId: string; userId: string }
    >({
      query: ({ networkId, userId }) => ({
        url: `network/${networkId}/members`,
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { networkId }) => [
        { type: "Network", id: networkId },
      ],
    }),

    // Connection endpoints
    getConnections: builder.query<Connection[], string | undefined>({
      query: (status) => `connection${status ? `?status=${status}` : ""}`,
      providesTags: ["Connection"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getFriends: builder.query<Connection[], void>({
      query: () => "connection/friends",
      providesTags: ["Connection"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getPendingConnections: builder.query<Connection[], void>({
      query: () => "connection/pending",
      providesTags: ["Connection"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getConnection: builder.query<Connection, string>({
      query: (id) => `connection/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Connection", id }],
    }),
    createConnection: builder.mutation<Connection, CreateConnectionRequest>({
      query: (connectionData) => ({
        url: "connection",
        method: "POST",
        body: connectionData,
      }),
      invalidatesTags: ["Connection"],
    }),
    updateConnectionStatus: builder.mutation<
      Connection,
      { id: string; status: "accepted" | "blocked" }
    >({
      query: ({ id, status }) => ({
        url: `connection/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Connection", id },
      ],
    }),
    removeConnection: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `connection/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connection"],
    }),
  }),
});

export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useResetPasswordMutation,

  // Users
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,

  // Posts
  useGetPostsQuery,
  useGetPostQuery,
  useGetUserPostsQuery,
  useGetNetworkPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useReactToPostMutation,

  // Networks
  useGetNetworksQuery,
  useGetNetworkQuery,
  useGetUserNetworksQuery,
  useCreateNetworkMutation,
  useUpdateNetworkMutation,
  useDeleteNetworkMutation,
  useAddNetworkMemberMutation,
  useRemoveNetworkMemberMutation,

  // Connections
  useGetConnectionsQuery,
  useGetFriendsQuery,
  useGetPendingConnectionsQuery,
  useGetConnectionQuery,
  useCreateConnectionMutation,
  useUpdateConnectionStatusMutation,
  useRemoveConnectionMutation,
} = api;
