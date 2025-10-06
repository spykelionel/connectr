import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Connection } from "../../services/api";

interface ConnectionsState {
  connections: Connection[];
  friends: Connection[];
  pendingConnections: Connection[];
  currentConnection: Connection | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  activeTab: "all" | "pending" | "suggestions";
  selectedConnection: Connection | null;
}

const initialState: ConnectionsState = {
  connections: [],
  friends: [],
  pendingConnections: [],
  currentConnection: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  activeTab: "all",
  selectedConnection: null,
};

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    setConnections: (state, action: PayloadAction<Connection[]>) => {
      state.connections = action.payload;
    },
    addConnection: (state, action: PayloadAction<Connection>) => {
      state.connections.unshift(action.payload);
    },
    updateConnection: (state, action: PayloadAction<Connection>) => {
      const index = state.connections.findIndex(
        (conn) => conn.id === action.payload.id
      );
      if (index !== -1) {
        state.connections[index] = action.payload;
      }

      const friendIndex = state.friends.findIndex(
        (conn) => conn.id === action.payload.id
      );
      if (friendIndex !== -1) {
        state.friends[friendIndex] = action.payload;
      }

      const pendingIndex = state.pendingConnections.findIndex(
        (conn) => conn.id === action.payload.id
      );
      if (pendingIndex !== -1) {
        state.pendingConnections[pendingIndex] = action.payload;
      }

      if (state.currentConnection?.id === action.payload.id) {
        state.currentConnection = action.payload;
      }

      if (state.selectedConnection?.id === action.payload.id) {
        state.selectedConnection = action.payload;
      }
    },
    removeConnection: (state, action: PayloadAction<string>) => {
      state.connections = state.connections.filter(
        (conn) => conn.id !== action.payload
      );
      state.friends = state.friends.filter(
        (conn) => conn.id !== action.payload
      );
      state.pendingConnections = state.pendingConnections.filter(
        (conn) => conn.id !== action.payload
      );

      if (state.currentConnection?.id === action.payload) {
        state.currentConnection = null;
      }

      if (state.selectedConnection?.id === action.payload) {
        state.selectedConnection = null;
      }
    },
    setFriends: (state, action: PayloadAction<Connection[]>) => {
      state.friends = action.payload;
    },
    setPendingConnections: (state, action: PayloadAction<Connection[]>) => {
      state.pendingConnections = action.payload;
    },
    setCurrentConnection: (state, action: PayloadAction<Connection | null>) => {
      state.currentConnection = action.payload;
    },
    setSelectedConnection: (
      state,
      action: PayloadAction<Connection | null>
    ) => {
      state.selectedConnection = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveTab: (
      state,
      action: PayloadAction<"all" | "pending" | "suggestions">
    ) => {
      state.activeTab = action.payload;
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
  setConnections,
  addConnection,
  updateConnection,
  removeConnection,
  setFriends,
  setPendingConnections,
  setCurrentConnection,
  setSelectedConnection,
  setSearchQuery,
  setActiveTab,
  setLoading,
  setError,
  clearError,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
