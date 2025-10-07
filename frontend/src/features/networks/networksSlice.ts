import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Network } from "../../services/api";

interface NetworksState {
  networks: Network[];
  userNetworks: Network[];
  currentNetwork: Network | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  viewMode: "grid" | "list";
}

const initialState: NetworksState = {
  networks: [],
  userNetworks: [],
  currentNetwork: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedCategory: null,
  viewMode: "grid",
};

const networksSlice = createSlice({
  name: "networks",
  initialState,
  reducers: {
    setNetworks: (state, action: PayloadAction<Network[]>) => {
      state.networks = action.payload;
    },
    addNetwork: (state, action: PayloadAction<Network>) => {
      state.networks.unshift(action.payload);
    },
    updateNetwork: (state, action: PayloadAction<Network>) => {
      const index = state.networks.findIndex(
        (network) => network.id === action.payload.id
      );
      if (index !== -1) {
        state.networks[index] = action.payload;
      }

      const userIndex = state.userNetworks.findIndex(
        (network) => network.id === action.payload.id
      );
      if (userIndex !== -1) {
        state.userNetworks[userIndex] = action.payload;
      }

      if (state.currentNetwork?.id === action.payload.id) {
        state.currentNetwork = action.payload;
      }
    },
    removeNetwork: (state, action: PayloadAction<string>) => {
      state.networks = state.networks.filter(
        (network) => network.id !== action.payload
      );
      state.userNetworks = state.userNetworks.filter(
        (network) => network.id !== action.payload
      );

      if (state.currentNetwork?.id === action.payload) {
        state.currentNetwork = null;
      }
    },
    setUserNetworks: (state, action: PayloadAction<Network[]>) => {
      state.userNetworks = action.payload;
    },
    setCurrentNetwork: (state, action: PayloadAction<Network | null>) => {
      state.currentNetwork = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
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
  setNetworks,
  addNetwork,
  updateNetwork,
  removeNetwork,
  setUserNetworks,
  setCurrentNetwork,
  setSearchQuery,
  setSelectedCategory,
  setViewMode,
  setLoading,
  setError,
  clearError,
} = networksSlice.actions;

export default networksSlice.reducer;
