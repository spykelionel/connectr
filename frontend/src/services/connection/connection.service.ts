import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../util/util.service";
import { Connection, CreateConnectionRequest } from "./interface";

export const connectionApi = createApi({
  reducerPath: "connectionApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Connection"],
  endpoints: (builder) => ({
    getConnections: builder.query<Connection[], string | undefined>({
      query: (status) => `connection${status ? `?status=${status}` : ""}`,
      providesTags: ["Connection"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getFriends: builder.query<Connection[], void>({
      query: () => "connection/friends",
      providesTags: ["Connection"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getPendingConnections: builder.query<Connection[], void>({
      query: () => "connection/pending",
      providesTags: ["Connection"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getConnection: builder.query<Connection, string>({
      query: (id) => `connection/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Connection", id }],
    }),
    createConnection: builder.mutation<Connection, CreateConnectionRequest>({
      query: (connectionData) => ({
        url: "connection",
        method: "POST",
        body: connectionData,
      }),
      invalidatesTags: ["Connection"],
    }),
    updateConnectionStatus: builder.mutation<
      Connection,
      { id: string; status: "accepted" | "blocked" }
    >({
      query: ({ id, status }) => ({
        url: `connection/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Connection", id },
      ],
    }),
    removeConnection: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `connection/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connection"],
    }),
  }),
});

export const {
  useGetConnectionsQuery,
  useGetFriendsQuery,
  useGetPendingConnectionsQuery,
  useGetConnectionQuery,
  useCreateConnectionMutation,
  useUpdateConnectionStatusMutation,
  useRemoveConnectionMutation,
} = connectionApi;
