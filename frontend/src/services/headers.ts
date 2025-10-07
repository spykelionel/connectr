import { RootState } from "../store";

export const preparedHeaders = (headers: Headers, { getState }: any) => {
  const { access_token } = (getState() as RootState).auth;

  if (access_token) {
    headers.set("authorization", `Bearer ${access_token}`);
  }

  headers.set("Content-Type", "application/json");
  return headers;
};
