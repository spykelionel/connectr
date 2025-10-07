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
