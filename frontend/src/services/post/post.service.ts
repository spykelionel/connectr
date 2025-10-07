import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../util/util.service";
import { CreatePostRequest, Post } from "./interface";

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
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetUserPostsQuery,
  useGetNetworkPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useReactToPostMutation,
} = postApi;
