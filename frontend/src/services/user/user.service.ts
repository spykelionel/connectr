import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../util/util.service";
import { User } from "./interface";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "auth/users",
      providesTags: ["User"],
    }),
    getUser: builder.query<User, string>({
      query: (id) => `user/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    searchUsers: builder.query<User[], string>({
      query: (searchQuery) =>
        `user/search?q=${encodeURIComponent(searchQuery)}`,
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `auth/update-user/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useSearchUsersQuery,
  useUpdateUserMutation,
} = userApi;
