import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../services/api";

interface UserState {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser?.id === action.payload.id) {
        state.currentUser = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
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
  },
});

export const {
  setCurrentUser,
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setSearchQuery,
  setSelectedUser,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
