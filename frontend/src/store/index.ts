import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import connectionsReducer from "../features/connections/connectionsSlice";
import networksReducer from "../features/networks/networksSlice";
import postsReducer from "../features/posts/postsSlice";
import uiReducer from "../features/ui/uiSlice";
import userReducer from "../features/user/userSlice";
import {
  authApi,
  authReducer,
  connectionApi,
  networkApi,
  postApi,
  userApi,
  utilApi,
} from "../services/api";
import { uploadApi } from "../services/uploadApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [networkApi.reducerPath]: networkApi.reducer,
    [connectionApi.reducerPath]: connectionApi.reducer,
    [utilApi.reducerPath]: utilApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    auth: authReducer,
    user: userReducer,
    posts: postsReducer,
    networks: networksReducer,
    connections: connectionsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      postApi.middleware,
      networkApi.middleware,
      connectionApi.middleware,
      utilApi.middleware,
      uploadApi.middleware
    ),
  devTools: true,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
