import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../../services/api";

interface PostsState {
  posts: Post[];
  userPosts: Post[];
  networkPosts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  limit: number;
}

const initialState: PostsState = {
  posts: [],
  userPosts: [],
  networkPosts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
  limit: 10,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = [...state.posts, ...action.payload];
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }

      const userIndex = state.userPosts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (userIndex !== -1) {
        state.userPosts[userIndex] = action.payload;
      }

      const networkIndex = state.networkPosts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (networkIndex !== -1) {
        state.networkPosts[networkIndex] = action.payload;
      }

      if (state.currentPost?.id === action.payload.id) {
        state.currentPost = action.payload;
      }
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      state.userPosts = state.userPosts.filter(
        (post) => post.id !== action.payload
      );
      state.networkPosts = state.networkPosts.filter(
        (post) => post.id !== action.payload
      );

      if (state.currentPost?.id === action.payload) {
        state.currentPost = null;
      }
    },
    setUserPosts: (state, action: PayloadAction<Post[]>) => {
      state.userPosts = action.payload;
    },
    setNetworkPosts: (state, action: PayloadAction<Post[]>) => {
      state.networkPosts = action.payload;
    },
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetPagination: (state) => {
      state.page = 1;
      state.hasMore = true;
    },
  },
});

export const {
  setPosts,
  addPosts,
  addPost,
  updatePost,
  removePost,
  setUserPosts,
  setNetworkPosts,
  setCurrentPost,
  setLoading,
  setError,
  clearError,
  setHasMore,
  setPage,
  incrementPage,
  resetPagination,
} = postsSlice.actions;

export default postsSlice.reducer;
