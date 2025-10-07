import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  notifications: Notification[];
  modals: {
    createPost: boolean;
    createNetwork: boolean;
    editProfile: boolean;
    settings: boolean;
  };
  loading: {
    global: boolean;
    auth: boolean;
    posts: boolean;
    networks: boolean;
    connections: boolean;
  };
  toast: {
    message: string;
    type: "success" | "error" | "warning" | "info";
    visible: boolean;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

const initialState: UIState = {
  theme: "dark",
  sidebarOpen: true,
  mobileMenuOpen: false,
  notifications: [],
  modals: {
    createPost: false,
    createNetwork: false,
    editProfile: false,
    settings: false,
  },
  loading: {
    global: false,
    auth: false,
    posts: false,
    networks: false,
    connections: false,
  },
  toast: {
    message: "",
    type: "info",
    visible: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "read" | "createdAt">>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<keyof UIState["modals"]>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState["modals"]>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UIState["modals"]] = false;
      });
    },
    setLoading: (
      state,
      action: PayloadAction<{ key: keyof UIState["loading"]; value: boolean }>
    ) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "warning" | "info";
      }>
    ) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
        visible: true,
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setGlobalLoading,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
