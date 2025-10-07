import { RootState } from "../store";
import { IAuthUser } from "./auth/interface";

export const preparedHeaders = (headers: Headers, { getState }: any) => {
  const { access_token } = (getState() as RootState).auth as IAuthUser;

  if (access_token) {
    headers.set("authorization", `Bearer ${access_token}`);
  }
  return headers;
};
