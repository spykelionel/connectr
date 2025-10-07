import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../lib/config";
import { LocalStorage } from "../lib/util/localStorage";
import { RootState } from "../store";
import { logOutUser } from "./auth/auth.service";
import { preparedHeaders } from "./headers";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: preparedHeaders,
});

export async function baseQueryWithReauth(
  args: FetchArgs | string,
  api: BaseQueryApi,
  extraOptions: any
) {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = LocalStorage.getItem("refresh_token");

    if (!refreshToken) {
      console.error("No refresh token available, logging out user.");
      api.dispatch(logOutUser());
      return result;
    }

    const refreshResponse = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
        headers: {
          "Content-Type": "application/json",
        },
      },
      api,
      extraOptions
    );

    if (refreshResponse.error) {
      console.error("Refresh token request failed", refreshResponse.error);
      api.dispatch(logOutUser());
      throw refreshResponse.error;
    }

    if (refreshResponse.data) {
      const data = refreshResponse.data as any;
      const { user } = (api.getState() as RootState).auth;

      const { access_token, refresh_token } = data?.data as {
        access_token: string;
        refresh_token: string;
      };

      // Update tokens in localStorage
      LocalStorage.setItem("access_token", access_token);
      LocalStorage.setItem("refresh_token", refresh_token);

      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOutUser());
    }
  }

  return result;
}
