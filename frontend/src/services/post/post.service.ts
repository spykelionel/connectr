import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../util/util.service";
import {
  Comment,
  CreateCommentRequest,
  CreatePostRequest,
  PaginatedPostsResponse,
  PaginationParams,
  Post,
} from "./interface";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Post", "Comment"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "post",
      providesTags: ["Post"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getPostsPaginated: builder.query<PaginatedPostsResponse, PaginationParams>({
      query: ({ page = 1, limit = 10 }) =>
        `post/paginated?page=${page}&limit=${limit}`,
      providesTags: ["Post"],
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return {
          posts: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      },
    }),
    getPostsInfinite: builder.query<PaginatedPostsResponse, PaginationParams>({
      query: ({ page = 1, limit = 10 }) =>
        `post/paginated?page=${page}&limit=${limit}`,
      providesTags: ["Post"],
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return {
          posts: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...otherArgs } = queryArgs;
        return otherArgs;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          posts: [...currentCache.posts, ...newItems.posts],
          pagination: newItems.pagination,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
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
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: (commentData) => ({
        url: "comment",
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Post", id: postId },
        "Post",
        "Comment",
      ],
    }),
    deleteComment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `comment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment", "Post"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsPaginatedQuery,
  useGetPostQuery,
  useGetUserPostsQuery,
  useGetNetworkPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useReactToPostMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = postApi;
