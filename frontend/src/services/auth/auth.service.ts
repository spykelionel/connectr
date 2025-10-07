import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { LocalStorage } from "../../lib/util/localStorage";
import { baseQueryWithReauth } from "../util/util.service";
import {
  AuthResponse,
  IAuthUser,
  LoginRequest,
  RegisterRequest,
} from "./interface";

// Initial state
const initialState: IAuthUser = {
  user: LocalStorage.getItem("user"),
  refresh_token: LocalStorage.getItem("refresh_token"),
  access_token: LocalStorage.getItem("access_token"),
  sessionId: null,
  sessionExpireAt: null,
};

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
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
  }),
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveUser: (state, { payload }: PayloadAction<IAuthUser>) => {
      try {
        const { access_token, user, refresh_token } = payload;
        state.access_token = access_token;
        state.user = user;
        state.refresh_token = refresh_token;

        // Persist to localStorage
        LocalStorage.setItem("access_token", access_token!);
        LocalStorage.setItem("refresh_token", refresh_token!);
        LocalStorage.setItem("user", user!);
      } catch (error) {
        console.error("Error saving user session", error);
      }
    },
    logOutUser: (state) => {
      try {
        state.access_token = null;
        state.refresh_token = null;
        state.user = null;
        state.sessionId = null;
        state.sessionExpireAt = null;

        // Clear localStorage
        LocalStorage.remove("access_token");
        LocalStorage.remove("refresh_token");
        LocalStorage.remove("user");
      } catch (error) {
        console.error("Error removing user session", error);
      }
    },
  },
});

export const { saveUser, logOutUser } = authSlice.actions;

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useResetPasswordMutation,
} = authApi;

export const authReducer = authSlice.reducer;
export { authApi };
