import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  access_token: localStorage.getItem("access_token"),
  refresh_token: localStorage.getItem("refresh_token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  isAuthenticated: !!localStorage.getItem("access_token"),
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
      localStorage.setItem("access_token", action.payload.access_token);
      if (action.payload.refresh_token) {
        localStorage.setItem("refresh_token", action.payload.refresh_token);
      }
      localStorage.setItem("user", JSON.stringify(action.payload.user));
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
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthState["user"]>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
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
