import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorage } from "../../lib/util/localStorage";

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    profileurl?: string;
    isAdmin: boolean;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  access_token: LocalStorage.getItem("access_token"),
  refresh_token: LocalStorage.getItem("refresh_token"),
  user: LocalStorage.getItem("user"),
  isAuthenticated: !!LocalStorage.getItem("access_token"),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        access_token: string;
        refresh_token?: string;
        user: any;
      }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token || state.refresh_token;
      state.user = action.payload.user;
      state.error = null;

      // Persist to localStorage
      LocalStorage.setItem("access_token", action.payload.access_token);
      if (action.payload.refresh_token) {
        LocalStorage.setItem("refresh_token", action.payload.refresh_token);
      }
      LocalStorage.setItem("user", action.payload.user);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.access_token = null;
      state.refresh_token = null;
      state.user = null;
      state.error = null;

      // Clear localStorage
      LocalStorage.remove("access_token");
      LocalStorage.remove("refresh_token");
      LocalStorage.remove("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthState["user"]>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        LocalStorage.setItem("user", state.user);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
