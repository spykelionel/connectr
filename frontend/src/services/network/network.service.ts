import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../util/util.service";
import { CreateNetworkRequest, Network } from "./interface";

export const networkApi = createApi({
  reducerPath: "networkApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Network"],
  endpoints: (builder) => ({
    getNetworks: builder.query<Network[], void>({
      query: () => "network",
      providesTags: ["Network"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    getNetwork: builder.query<Network, string>({
      query: (id) => `network/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Network", id }],
    }),
    getUserNetworks: builder.query<Network[], string>({
      query: (userId) => `network/user/${userId}`,
      providesTags: ["Network"],
      transformResponse: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
    createNetwork: builder.mutation<Network, CreateNetworkRequest>({
      query: (networkData) => ({
        url: "network",
        method: "POST",
        body: networkData,
      }),
      invalidatesTags: ["Network"],
    }),
    updateNetwork: builder.mutation<
      Network,
      { id: string; data: Partial<Network> }
    >({
      query: ({ id, data }) => ({
        url: `network/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Network", id }],
    }),
    deleteNetwork: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `network/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Network"],
    }),
    addNetworkMember: builder.mutation<
      { message: string },
      { networkId: string; userId: string }
    >({
      query: ({ networkId, userId }) => ({
        url: `network/${networkId}/members`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { networkId }) => [
        { type: "Network", id: networkId },
      ],
    }),
    removeNetworkMember: builder.mutation<
      { message: string },
      { networkId: string; userId: string }
    >({
      query: ({ networkId, userId }) => ({
        url: `network/${networkId}/members`,
        method: "DELETE",
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { networkId }) => [
        { type: "Network", id: networkId },
      ],
    }),
    joinNetwork: builder.mutation<{ message: string }, string>({
      query: (networkId) => ({
        url: `network/${networkId}/join`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, networkId) => [
        { type: "Network", id: networkId },
        "Network",
      ],
    }),
    leaveNetwork: builder.mutation<{ message: string }, string>({
      query: (networkId) => ({
        url: `network/${networkId}/leave`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, networkId) => [
        { type: "Network", id: networkId },
        "Network",
      ],
    }),
  }),
});

export const {
  useGetNetworksQuery,
  useGetNetworkQuery,
  useGetUserNetworksQuery,
  useCreateNetworkMutation,
  useUpdateNetworkMutation,
  useDeleteNetworkMutation,
  useAddNetworkMemberMutation,
  useRemoveNetworkMemberMutation,
  useJoinNetworkMutation,
  useLeaveNetworkMutation,
} = networkApi;
