export interface User {
  id: string;
  name: string;
  email: string;
  gender?: string;
  contact?: string;
  profileurl?: string;
  isAdmin: boolean;
  roleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  gender?: string;
  contact?: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    id: string;
    name: string;
    gender?: string | null;
    email: string;
    contact?: string | null;
    profileurl?: string | null;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    refreshToken?: string | null;
    roleId?: string | null;
    access_token: string;
    refresh_token: string;
    isFavorite?: boolean;
    userName: string;
    userId: string;
    user?: {
      id: string;
      name: string;
      gender?: string | null;
      email: string;
      contact?: string | null;
      profileurl?: string | null;
      createdAt: string;
      roleId?: string | null;
    };
  };
}

export interface IAuthUser {
  refresh_token: string | null;
  access_token: string | null;
  user: User | null;
  sessionId?: string | null;
  sessionExpireAt?: number | null;
}
